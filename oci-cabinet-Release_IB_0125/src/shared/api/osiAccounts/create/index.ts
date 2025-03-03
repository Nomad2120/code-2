import { instance } from '@shared/api/config';
import { path } from '@shared/api/osiAccounts/config';
import { OsiAccountRequest } from '@shared/types/osi/accounts';

export const createOsiAccount = (payload: OsiAccountRequest) => instance.post(`${path}`, payload);
