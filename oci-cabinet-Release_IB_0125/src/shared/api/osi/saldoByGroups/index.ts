import { instance } from '@shared/api/config';
import { path } from '@shared/api/osi';
import { ServiceGroupSaldoResponse } from '@shared/types/osi/saldoByGroups';

export const getOsiSaldoByGroupsByOsiId = (osiId: number): Promise<ServiceGroupSaldoResponse[]> =>
  instance.get(`${path}/${osiId}/saldo-by-groups`);
