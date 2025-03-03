import { RegistrationAccountRequest } from '@shared/types/registration';
import { instance } from '@shared/api/config';
import { path } from '../index';

export const updateRegistrationAccount = (id: number, payload: RegistrationAccountRequest) =>
  instance.put(`${path}/${id}`, payload);
