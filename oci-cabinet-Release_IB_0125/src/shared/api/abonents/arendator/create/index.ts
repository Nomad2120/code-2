import { instance } from '@shared/api/config';
import { Arendator, ArendatorRequest } from '@shared/types/osi/abonents';
import { path } from '../../config';

export const createArendator = (payload: ArendatorRequest): Promise<Arendator> =>
  instance.post(`${path}/arendator`, payload);
