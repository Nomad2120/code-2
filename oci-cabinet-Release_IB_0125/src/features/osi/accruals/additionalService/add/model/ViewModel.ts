import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { IAddAdditionalServiceButtonViewModel } from '@shared/types/mobx/features/osiAccruals';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { createOsiService } from '@shared/api/osiServices/create';
import { AbonentOnServiceRequest, OsiServiceRequest } from '@shared/types/osi/services';
import { OsiModule } from '@mobx/services/osiModule';
import { editOsiServiceAbonents } from '@shared/api/osiServices/abonents/edit';

@injectable()
export class AddAdditionalServiceButtonViewModel implements IAddAdditionalServiceButtonViewModel {
  externalAbonents: any[] = [];

  isCreateAbonentDialogOpen = false;

  isDialogOpen = false;

  isLoading = false;

  private _hookForm: any = null;

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);
  }

  get osiId() {
    return this.osiModule.osiId ?? 0;
  }

  cancelCreatingAbonent = () => {
    this.isCreateAbonentDialogOpen = false;
  };

  closeDialog = () => {
    this.isDialogOpen = false;
    this._hookForm?.reset();
  };

  onCreateAdditionalServiceClick = async (values: any) => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');
      const payload: OsiServiceRequest = {
        osiId: this.osiModule.osiId,
        nameRu: values.service.nameRu,
        nameKz: values.service.nameKz,
        serviceGroupId: values.serviceGroupId,
        accuralMethodId: 2,
        amount: values.amount
      };
      const service = await createOsiService(payload);

      if (!service.id) throw new Error('service id is undefined');

      const arendatorId = values.arendator.value.id;
      const abonentPayload: AbonentOnServiceRequest[] = [
        {
          abonentId: arendatorId,
          checked: true,
          parkingPlaces: 0
        }
      ];

      await editOsiServiceAbonents(service.id, abonentPayload);
      this.closeDialog();
      this._reloadCb?.();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  openDialog = () => {
    this.externalAbonents = [];
    this._hookForm?.trigger();
    this.isDialogOpen = true;
  };

  setHookForm = (hookForm: any) => {
    this._hookForm = hookForm;
  };

  setReloadCb = (cb: any) => {
    this._reloadCb = cb;
  };

  startCreatingAbonent = () => {
    this.isCreateAbonentDialogOpen = true;
  };

  submitCreatingAbonent = () => {};

  private _reloadCb: any = () => {};
}
