import { instance } from '@shared/api/config';
import { AbonentOnServiceRequest } from '@shared/types/osi/services';
import { path } from '../../config';

export const editOsiServiceAbonents = (id: number, payload: AbonentOnServiceRequest[]): Promise<void> =>
  instance.put(`${path}/${id}/abonents`, payload);
