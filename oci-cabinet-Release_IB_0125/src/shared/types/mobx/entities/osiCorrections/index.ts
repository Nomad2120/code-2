import { Abonent } from '@shared/types/osi/abonents';

export interface IOsiCorrectionFormViewModel {
  isLoading: boolean;
  abonents: Abonent[];
  getAbonents: (serviceGroupId: number) => Abonent[];
  services: any;
  onSubmitCb: any;
  onSubmit: (values: any) => Promise<void>;
}

export const IOsiCorrectionFormViewModelToken = Symbol.for('IOsiCorrectionFormViewModel');
