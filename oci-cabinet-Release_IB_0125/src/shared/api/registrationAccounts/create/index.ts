import { instance } from '@shared/api/config';
import { RegistrationAccount, RegistrationAccountRequest } from '@shared/types/registration';
import { path } from '../index';

export const createRegistrationAccount = (payload: RegistrationAccountRequest): Promise<RegistrationAccount> =>
  instance.post(`${path}`, payload);
