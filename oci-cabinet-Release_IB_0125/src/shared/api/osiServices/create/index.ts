import { instance } from '@shared/api/config';
import { OsiService, OsiServiceRequest } from '@shared/types/osi/services';
import { path } from '../config';

export const createOsiService = (payload: OsiServiceRequest): Promise<OsiService> => instance.post(`${path}`, payload);
