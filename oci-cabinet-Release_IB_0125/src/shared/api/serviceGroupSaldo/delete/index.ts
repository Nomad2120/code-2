import { instance } from '@shared/api/config';
import { path } from '../config';

export const deleteServiceGroupSaldo = (
  saldoId: number
): Promise<{
  code: number;
  message: string;
}> => instance.delete(`${path}/${saldoId}`);
