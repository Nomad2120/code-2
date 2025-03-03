import { CORE_PATH } from '@shared/api/paths';
import { instance } from '@shared/api/config';

const MAIN_PATH = 'KeyValues';

export const path = `${CORE_PATH}/${MAIN_PATH}`;

export const getValueByKey = (key: string): Promise<string> => instance.get(`${path}/${key}`);

export const getValuesByKeys = (keys: string[]): Promise<Record<string, string>> => instance.post(`${path}`, keys);
