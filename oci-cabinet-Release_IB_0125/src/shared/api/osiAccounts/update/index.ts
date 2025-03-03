import { instance } from '@shared/api/config';
import { path } from '@shared/api/osiAccounts/config';
import { OsiAccountRequest } from '@shared/types/osi/accounts';

export const updateOsiAccountById = (accountId: number, payload: OsiAccountRequest) =>
  instance.put(`${path}/${accountId}`, payload);
