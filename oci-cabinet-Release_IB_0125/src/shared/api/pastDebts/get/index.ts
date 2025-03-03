import { instance } from '@shared/api/config';
import { PastDebtsResponse } from '@shared/types/osi/debts';
import { path } from '../config';

export const getPastDebts = (abonentId: number, serviceGroupId: number): Promise<PastDebtsResponse> =>
  instance.get(`${path}?abonentId=${abonentId}&serviceGroupId=${serviceGroupId}`);
