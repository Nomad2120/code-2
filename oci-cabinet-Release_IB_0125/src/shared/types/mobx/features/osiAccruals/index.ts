import { AbonentOnServiceResponse, OsiServiceResponse } from '@shared/types/osi/services';
import { GridSelectionModel } from '@mui/x-data-grid';
import { AreaTypeCodes } from '@shared/types/dictionaries';
import { MutableRefObject } from 'react';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';
import { RefHandle } from '@features/osi/accruals/abonents/ui/OsiServiceAbonentsButton';

export interface IPenaltiesToggleViewModel {
  isFinesEnabled: boolean;
  toggleFines: () => Promise<void>;
}

export const IPenaltiesToggleViewModelToken = Symbol.for('IPenaltiesToggleViewModel');

export interface IAddServiceButtonFeatureViewModel {
  isDialogOpen: boolean;
  isLoading: boolean;
  closeDialog: () => void;
  openDialog: () => void;
  createService: (values: any) => Promise<void>;
  service: OsiServiceResponse | null;
  abonentsTableRef: MutableRefObject<RefHandle | null>;

  setHookForm: (hookForm: any) => void;
  setReloadCb: (cb: any) => void;
}

export const IAddServiceButtonFeatureViewModelToken = Symbol.for('IAddServiceButtonFeatureViewModel');

export interface IEditServiceButtonFeatureViewModel {
  isDialogOpen: boolean;
  isLoading: boolean;
  closeDialog: () => void;
  openDialog: () => void;
  editService: (values: any) => Promise<void>;
  onEditServiceClick: (service: OsiServiceResponse, isCustom: boolean) => void;

  setHookForm: (hookForm: any) => void;
  setReloadCb: (cb: any) => void;
}

export const IEditServiceButtonFeatureViewModelToken = Symbol.for('IEditServiceButtonFeatureViewModel');

export interface IOsiServiceAbonentsButtonFeatureViewModel {
  service: OsiServiceResponse | null;
  abonents: AbonentOnServiceResponse[];
  activeAbonentsCount: number;
  abonentsCount: number;
  isAbonentsTableLoading: boolean;
  isLoading: boolean;
  isAdditionalService: boolean;
  isParkingService: boolean;
  isDialogOpen: boolean;
  openAbonentsTable: () => Promise<void>;
  cancelEditing: () => void;
  save: () => Promise<void>;
  selectedAbonentsIds: GridSelectionModel;
  reloadCb: any;
  apiRef: MutableRefObject<GridApiPro>;

  selectByType: (type: AreaTypeCodes) => void;
  unselectByType: (type: AreaTypeCodes) => void;
  selectorStateByType: (type: AreaTypeCodes) => { checked: boolean; indeterminate: boolean; disabled: boolean };

  changeParkingPlaces: (abonentId: number, parkingPlaces: number | string) => void;
}

export const IOsiServiceAbonentsButtonFeatureViewModelToken = Symbol.for('IOsiServiceAbonentsButtonFeatureViewModel');

export interface IAddAdditionalServiceButtonViewModel {
  isDialogOpen: boolean;
  isLoading: boolean;
  closeDialog: () => void;
  openDialog: () => void;

  isCreateAbonentDialogOpen: boolean;
  cancelCreatingAbonent: () => void;
  startCreatingAbonent: () => void;
  submitCreatingAbonent: () => void;

  externalAbonents: any[];

  onCreateAdditionalServiceClick: (values: any) => Promise<void>;

  setHookForm: (hookForm: any) => void;
  setReloadCb: (cb: any) => void;
  osiId: number;
}

export const IAddAdditionalServiceButtonViewModelToken = Symbol.for('IAddAdditionalServiceButtonViewModel');

export interface IEditAdditionalServiceFeatureViewModel {
  isLoading: boolean;
  isDialogOpen: boolean;
  closeDialog: () => void;
  openDialog: () => void;
  onEditServiceClick: (service: OsiServiceResponse, isCustomName: boolean) => Promise<void>;
  onSubmitEditServiceClick: (values: any) => Promise<void>;

  setHookForm: (hookForm: any) => void;
  setReloadCb: (cb: any) => void;
  osiId: number;
}

export const IEditAdditionalServiceFeatureViewModelToken = Symbol.for('IEditAdditionalServiceFeatureViewModel');
