import { Abonent } from '@shared/types/osi/abonents';

export interface IOsiFlatOsvWidgetViewModel {
  isLoading: boolean;
  totalsOsv: any[];
  abonents: Abonent[];
  selectedAbonent: Abonent | null;
  rows: any[];
  periodsNumber: number;
  loadAbonents: () => Promise<void>;
  loadOsv: () => Promise<void>;
  downloadOsv: () => Promise<void>;
}

export const IOsiFlatOsvWidgetViewModelToken = Symbol.for('IOsiFlatOsvWidgetViewModel');
