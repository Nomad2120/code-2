import { Abonent } from '@shared/types/osi/abonents';

export interface IOsiPaymentFormViewModel {
  isLoading: boolean;
  abonents: Abonent[];
  getAbonents: (serviceGroupId: number) => Abonent[];
  getAbonentOptionLabel: (option: Abonent) => string;
  onSubmit: (values: any) => Promise<void>;
  submitCb: any;
}

export const IOsiPaymentFormViewModelToken = Symbol.for('IOsiPaymentFormViewModel');
