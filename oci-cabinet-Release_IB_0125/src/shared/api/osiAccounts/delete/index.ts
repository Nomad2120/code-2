import { instance } from '@shared/api/config';
import { path } from '@shared/api/osiAccounts/config';

export const deleteOsiAccountById = (accountId: number) => instance.delete(`${path}/${accountId}`);
