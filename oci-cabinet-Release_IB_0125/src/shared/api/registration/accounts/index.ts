import { instance } from '@shared/api/config';
import { RegistrationAccount } from '@shared/types/registration';
import { path } from '../index';

export const getAccountsByRegistrationId = (registrationId: number): Promise<RegistrationAccount[]> =>
  instance.get(`${path}/${registrationId}/accounts`);
