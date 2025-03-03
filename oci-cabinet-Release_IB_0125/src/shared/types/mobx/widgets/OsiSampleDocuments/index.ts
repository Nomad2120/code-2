import { Abonent } from '@shared/types/osi/abonents';

export interface IOsiSampleDocumentsWidgetViewModel {
  sortedAbonents: Abonent[];
  downloadDebtor: (abonent: Abonent) => Promise<void>;
  downloadNotary: (abonent: Abonent) => Promise<void>;
  isLoading: boolean;
}

export const IOsiSampleDocumentsWidgetViewModelToken = Symbol.for('IOsiSampleDocumentsWidgetViewModel');
