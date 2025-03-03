import { instance } from '@shared/api/config';
import { path } from '../../config';

export const getDebtsByOsiId = (
  osiId: number,
  period: {
    begin: any;
    end: any;
  }
): Promise<any> => instance.get(`${path}/debts/${osiId}?begin=${period.begin}&end=${period.end}`);
