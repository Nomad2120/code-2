import { AbonentOnServiceResponse } from '@shared/types/osi/services';
import { instance } from '@shared/api/config';
import { path } from '../../config';

export const getOsiServiceAbonents = (id: number): Promise<AbonentOnServiceResponse[]> =>
  instance.get(`${path}/${id}/abonents`);
