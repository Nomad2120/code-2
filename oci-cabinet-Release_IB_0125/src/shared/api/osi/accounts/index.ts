import { instance } from '@shared/api/config';
import { CORE_PATH } from '@shared/api/paths';
import { OsiAccount } from '@/shared/types/osi';

const MAIN_PATH = 'Osi';

const path = `${CORE_PATH}/${MAIN_PATH}`;

export const getOsiAccountsByOsiId = (osiId: number): Promise<OsiAccount[]> =>
  instance.get(`${path}/${osiId}/accounts`);
