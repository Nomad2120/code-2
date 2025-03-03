import { instance } from '@shared/api/config';
import { ServiceGroupSaldo, ServiceGroupSaldoRequest } from '@shared/types/osi/serviceGroupSaldo';
import { path } from '../config';

export const createServiceGroupSaldo = (payload: ServiceGroupSaldoRequest): Promise<ServiceGroupSaldo> =>
  instance.post(`${path}`, payload);
