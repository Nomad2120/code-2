import { instance } from '@shared/api/config';
import { path } from '../config';

export const updateServiceGroupSaldoById = (
  saldoId: number,
  payload: number
): Promise<{
  code: number;
  message: string;
}> => instance.put(`${path}/${saldoId}`, payload);
