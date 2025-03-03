import { CORE_PATH } from '@shared/api/paths';
import { RegistrationAccount } from '@shared/types/registration';
import { instance } from '@shared/api/config';

const MAIN_PATH = 'RegistrationAccounts';

export const path = `${CORE_PATH}/${MAIN_PATH}`;

export const getRegistrationAccountById = (id: number): Promise<RegistrationAccount> => instance.get(`${path}/${id}`);
