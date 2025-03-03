import { CORE_PATH } from '@shared/api/paths';
import { instance } from '@shared/api/config';
import {
  AddScanDoc,
  ApiResponse,
  OsiAccountApplication,
  OsiAccountApplicationCheckRequest,
  OsiAccountApplicationDoc,
  OsiAccountApplicationRequest
} from '@shared/types/osiAccountApplications';
import MockAdapter from 'axios-mock-adapter';
import { appDocsMock, application } from '@shared/api/osiAccountApplications/mocks';

const MAIN_PATH = 'OsiAccountApplications';

const path = `${CORE_PATH}/${MAIN_PATH}`;

export const getOsiAccountApplicationById = (applicationId: number): Promise<OsiAccountApplication> =>
  instance.get(`${path}/${applicationId}`);

export const getOsiAccountApplicationDocsById = (applicationId: number): Promise<OsiAccountApplicationDoc[]> =>
  instance.get(`${path}/${applicationId}/docs`);

export const attachDocToOsiAccountApplication = (
  applicationId: number,
  payload: AddScanDoc
): Promise<OsiAccountApplicationDoc> => instance.post(`${path}/${applicationId}/docs`, payload);

export const checkIsHasActiveOsiAccountApplication = (
  payload: OsiAccountApplicationCheckRequest
): Promise<ApiResponse> => instance.post(`${path}/check`, payload);

export const createOsiApplication = (payload: OsiAccountApplicationRequest): Promise<OsiAccountApplication> =>
  instance.post(`${path}`, payload);

/** mocks */

const mock = new MockAdapter(instance, { onNoMatch: 'passthrough' });

mock.restore();

mock.onGet(new RegExp(`${path}/\\d+$`)).reply(200, application);

mock.onGet(new RegExp(`${path}/\\d+\\/docs`)).reply(200, appDocsMock);

mock.onPost(new RegExp(`${path}`)).reply(200, application);

mock.onPost(new RegExp(`${path}/\\d+\\/docs`)).reply(200, { code: 0, message: 'Success' });

mock.onPost(new RegExp(`${path}/check`)).reply(200, { code: 0, message: 'Success' });
