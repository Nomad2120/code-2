import { instance } from '@shared/api/config';
import { PastDebtsByOsiResponse } from '@shared/types/osi/debts';
import { path } from '../index';

export const getOsiPastDebts = (osiId: number): Promise<PastDebtsByOsiResponse[]> =>
  instance.get(`${path}/${osiId}/past-debts`);
