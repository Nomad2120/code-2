import { Abonent } from '@shared/types/osi/abonents';

export interface IOsiOsvWidgetViewModel {
  isLoading: boolean;
  loadOsv: () => Promise<void>;
  downloadOsv: () => Promise<void>;
  sortedAbonents: Abonent[];
  abonentsCount: number;
  totalsOsv: any[];
  dateFieldValue: any;
  startDate: any;
  endDate: any;
}

export const IOsiOsvWidgetViewModelToken = Symbol.for('IOsiOsvWidgetViewModel');
