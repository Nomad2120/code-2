import { instance } from '@shared/api/config';
import { path } from '../index';

export const deleteRegistrationAccountById = (accountId: number) => instance.delete(`${path}/${accountId}`);
