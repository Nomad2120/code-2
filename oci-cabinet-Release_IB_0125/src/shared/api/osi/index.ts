import { instance } from '@shared/api/config';
import { CORE_PATH } from '@shared/api/paths';
import { OsiAccountApplication } from '@shared/types/osiAccountApplications';
import MockAdapter from 'axios-mock-adapter';
import { osiAccountApplications } from '@shared/api/osi/mocks';
import { Abonent } from '@shared/types/osi/abonents';
import { Osi, OsiDoc } from '@/shared/types/osi';

const MAIN_PATH = 'Osi';

export const path = `${CORE_PATH}/${MAIN_PATH}`;

export const getOsiInfoById = (osiId: number): Promise<Osi> => instance.get(`${path}/${osiId}`);
export const getOsiDocsById = (osiId: number): Promise<OsiDoc[]> => instance.get(`${path}/${osiId}/docs`);

export const getAccountApplications = (osiId: number): Promise<OsiAccountApplication[]> =>
  instance.get(`${path}/${osiId}/account-applications`);

export const loadAbonentsFromExcel = (osiId: number, payload: any): Promise<Abonent[]> =>
  instance.post(`${path}/${osiId}/load-abonents-from-excel`, Int8Array.from(payload), {
    headers: {
      'Content-Type': 'application/octet-stream'
    }
  });

export const remakeLastAccruals = (osiId: number): Promise<void> =>
  instance.put(`${path}/${osiId}/remake-last-accurals`);

/** mocks */

const mock = new MockAdapter(instance, { onNoMatch: 'passthrough' });

mock.restore();

mock.onGet(`${path}/13/account-applications`).reply(200, osiAccountApplications);
