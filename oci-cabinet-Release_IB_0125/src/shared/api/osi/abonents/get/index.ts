import { instance } from '@shared/api/config';
import { Abonent } from '@shared/types/osi/abonents';
import { path } from '../../index';

export const getOsiAbonents = (osiId: number, onlyExternals = false): Promise<Abonent[]> =>
  instance.get(`${path}/${osiId}/abonents?onlyExternals=${onlyExternals}`);
