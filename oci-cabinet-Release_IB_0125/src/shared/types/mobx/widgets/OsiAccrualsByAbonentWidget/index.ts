import { Abonent } from '@shared/types/osi/abonents';

export interface IOsiAccrualsByAbonentViewModel {
  isLoading: boolean;
  abonents: Abonent[];
  selectedAbonent: Abonent | null;
  rows: any[];
  dateValue: any;
  startDate: any;
  endDate: any;
  loadAbonents: () => Promise<void>;
  loadAccruals: () => Promise<void>;
}

export const IOsiAccrualsByAbonentViewModelToken = Symbol.for('IOsiAccrualsByAbonentViewModel');
