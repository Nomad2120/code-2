import { PastDebtInfo } from '@shared/types/osi/debts';
import { instance } from '@shared/api/config';
import { path } from '../config';

export const updatePastDebts = (abonentId: number, serviceGroupId: number, payload: PastDebtInfo[]): Promise<void> =>
  instance.post(`${path}?abonentId=${abonentId}&serviceGroupId=${serviceGroupId}`, payload);
