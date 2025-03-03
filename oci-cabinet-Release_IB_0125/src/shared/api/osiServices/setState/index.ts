import { instance } from '@shared/api/config';
import { path } from '../config';

export const setStateOsiService = (id: number, status: boolean) =>
  instance.put(`${path}/${id}/set-state?isActive=${status}`);
