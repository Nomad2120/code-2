import { instance } from '@shared/api/config';
import { ServiceGroupSaldo } from '@shared/types/osi/serviceGroupSaldo';
import { path } from '../config';

export const getServiceGroupSaldoById = (saldoId: number): Promise<ServiceGroupSaldo> =>
  instance.get(`${path}/${saldoId}`);
