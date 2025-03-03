import { instance } from '@shared/api/config';
import { path } from '@shared/api/abonents/config';
import { Abonent, AbonentRequest, ApiResponse } from '@shared/types/osi/abonents';

export const getAbonent = (abonentId: number): Promise<Abonent> => instance.get(`${path}/${abonentId}`);
export const updateAbonent = (abonentId: number, payload: AbonentRequest): Promise<ApiResponse> =>
  instance.put(`${path}/${abonentId}`, payload);
export const createAbonent = (payload: AbonentRequest): Promise<Abonent> => instance.post(path, payload);
