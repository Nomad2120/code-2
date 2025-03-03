import { makeAutoObservable } from 'mobx';
import { IOsiServiceAbonentsButtonFeatureViewModel } from '@shared/types/mobx/features/osiAccruals';
import { AbonentOnServiceRequest, AbonentOnServiceResponse, OsiServiceResponse } from '@shared/types/osi/services';
import { injectable } from 'inversify';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';
import { getOsiServiceAbonents } from '@shared/api/osiServices/abonents/get';
import { GridSelectionModel } from '@mui/x-data-grid';
import { editOsiServiceAbonents } from '@shared/api/osiServices/abonents/edit';
import { AreaTypeCodes } from '@shared/types/dictionaries';
import { MutableRefObject } from 'react';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';

const AdditionalServiceGroupId = 7;
const ParkingServiceGroupId = 4;

@injectable()
export class OsiServiceAbonentsButtonFeatureViewModel implements IOsiServiceAbonentsButtonFeatureViewModel {
  isDialogOpen = false;

  isAbonentsTableLoading = false;

  isLoading = false;

  abonents: AbonentOnServiceResponse[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  private _selectedAbonentsIds: GridSelectionModel = [];

  get selectedAbonentsIds(): GridSelectionModel {
    return this._selectedAbonentsIds;
  }

  set selectedAbonentsIds(selectedAbonentsIds: GridSelectionModel) {
    this._selectedAbonentsIds = selectedAbonentsIds;

    if (this.isParkingService) {
      this.parkingPlacesEdit();
    }
  }

  private _service: OsiServiceResponse | null = null;

  get service(): OsiServiceResponse | null {
    return this._service;
  }

  set service(service: OsiServiceResponse) {
    this._service = service;
  }

  get activeAbonentsCount(): number {
    return this._service?.countActiveAbonents ?? 0;
  }

  get abonentsCount(): number {
    return this._service?.countAllAbonents ?? 0;
  }

  get isAdditionalService(): boolean {
    return this._service?.serviceGroupId === AdditionalServiceGroupId;
  }

  get isParkingService(): boolean {
    return this._service?.serviceGroupId === ParkingServiceGroupId;
  }

  private _reloadCb: any = () => {};

  set reloadCb(reloadCb: any) {
    this._reloadCb = reloadCb;
  }

  private _apiRef: MutableRefObject<GridApiPro> | null = null;

  set apiRef(apiRef: MutableRefObject<GridApiPro>) {
    this._apiRef = apiRef;
  }

  parkingPlacesEdit = async () => {
    await this.setDefaultParkingPlaces();
  };

  setDefaultParkingPlaces = async () => {
    this.abonents
      .filter((abonent) => this.selectedAbonentsIds.includes(abonent.id ?? 0))
      .filter((abonent) => !abonent.parkingPlaces)
      .forEach(async (abonent): Promise<void> => {
        await this._apiRef?.current?.startCellEditMode({ id: abonent.id ?? 0, field: 'parkingPlaces' });
        await this._apiRef?.current?.setEditCellValue({ id: abonent.id ?? 0, field: 'parkingPlaces', value: 1 });
        await this._apiRef?.current?.stopCellEditMode({ id: abonent.id ?? 0, field: 'parkingPlaces' });
      });
  };

  selectByType = (type: AreaTypeCodes) => {
    const typedAbonents = this.abonents.filter((abonent) => abonent.areaTypeCode === type);
    this.selectedAbonentsIds = [
      ...this._selectedAbonentsIds,
      ...typedAbonents.map((abonent) => abonent.id ?? 0)
    ].filter((value, index, array) => array.indexOf(value) === index);
  };

  unselectByType = (type: AreaTypeCodes) => {
    const typedAbonentsIds = this.abonents
      .filter((abonent) => abonent.areaTypeCode === type)
      .map((abonent) => abonent.id ?? 0);

    this.selectedAbonentsIds = this._selectedAbonentsIds.filter((id) => !typedAbonentsIds.includes(id as number));
  };

  selectorStateByType = (type: AreaTypeCodes): { checked: boolean; indeterminate: boolean; disabled: boolean } => {
    const typedAbonents = this.abonents.filter((abonent) => abonent.areaTypeCode === type);
    const isAllSelected = typedAbonents.every((abonent) => this._selectedAbonentsIds.includes(abonent.id ?? 0));
    const isAllNotSelected = typedAbonents.every((abonent) => !this._selectedAbonentsIds.includes(abonent.id ?? 0));

    const status = {
      checked: typedAbonents.length ? isAllSelected : false,
      indeterminate: !isAllSelected && !isAllNotSelected,
      disabled: !typedAbonents.length
    };

    return status;
  };

  openAbonentsTable = async (): Promise<void> => {
    try {
      this.isAbonentsTableLoading = true;
      if (!this._service?.id) throw new Error('service id is undefined');

      this.abonents = await getOsiServiceAbonents(this._service.id);

      this.initialSelectAbonents();

      this.isAbonentsTableLoading = false;

      this.isDialogOpen = true;
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  initialSelectAbonents = () => {
    if (!this.abonents.length) return;

    const selectedIds = this.abonents.filter((abonent) => abonent.checked).map((abonent) => abonent.id) ?? [];

    this._selectedAbonentsIds = selectedIds as GridSelectionModel;
  };

  save = async (): Promise<void> => {
    try {
      if (!this._service?.id) throw new Error('service id is undefined');

      this.isLoading = true;

      const checkedAbonents = this.abonents
        .filter((abonent) => this.selectedAbonentsIds.includes(abonent.id ?? 0))
        .map((abonent) => {
          const parkingPlaces = (abonent?.parkingPlaces ?? 0) > 0 ? abonent.parkingPlaces : 1;

          const value: AbonentOnServiceRequest = {
            abonentId: Number(abonent.id),
            checked: true,
            parkingPlaces
          };
          return value;
        });
      const unCheckedAbonents = this.abonents
        .filter((abonent) => abonent.checked)
        .filter((abonent) => !this.selectedAbonentsIds.includes(abonent.id ?? 0))
        .map((abonent) => {
          const value: AbonentOnServiceRequest = {
            abonentId: Number(abonent.id),
            checked: false,
            parkingPlaces: abonent.parkingPlaces
          };
          return value;
        });

      const payload: AbonentOnServiceRequest[] = [...checkedAbonents, ...unCheckedAbonents];

      await editOsiServiceAbonents(this._service?.id, payload);
      await this._reloadCb?.();
      this.isDialogOpen = false;
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  cancelEditing = async (): Promise<void> => {
    this.isDialogOpen = false;
    await this._reloadCb?.();
  };

  changeParkingPlaces = (id: number, parkingPlaces: number | string): void => {
    const abonent = this.abonents.find((abonent) => abonent.id === id);
    if (!abonent || !this._apiRef?.current) return;

    abonent.parkingPlaces = Number(parkingPlaces);
  };
}
