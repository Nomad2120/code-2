import { Abonent } from '@shared/types/osi/abonents';

export interface IOsiCreatePaymentFeatureViewModel {
  isDialogOpen: boolean;
  abonents: Abonent[];
  groups: any[];
  user: any;
  openDialog: () => Promise<void>;
  closeDialog: (event?: any, reason?: string) => Promise<void>;
  isLoading: boolean;
  createPayment: (values: any) => Promise<void>;

  onSuccessCb: () => Promise<void>;
}

export const IOsiCreatePaymentFeatureViewModelToken = Symbol.for('IOsiCreatePaymentFeatureViewModel');
