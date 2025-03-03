import { Abonent } from '@shared/types/osi/abonents';
import { ServiceGroupResponse } from '@shared/types/osi/services';

export interface ICreateDebtFeatureViewModel {
  isLoading: boolean;
  isDialogOpen: boolean;
  startCreatingDebt: () => void;
  cancelCreatingDebt: () => void;
  isConfirmDialogOpen: boolean;
  confirmData: any;
  onConfirm: () => void;
  onCancel: () => void;
  getAbonents: (serviceGroupId: number | null) => Abonent[];
  groups: ServiceGroupResponse[];
  debt: any;
  loadDebts: (abonentId: number, serviceGroupId: number) => Promise<void>;
  onCellEditCommit: (params: any) => Promise<void>;

  form: any;
  refreshCb: any;
}

export const ICreateDebtFeatureViewModelToken = Symbol.for('ICreateDebtFeatureViewModel');
