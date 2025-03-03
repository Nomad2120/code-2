import { OsiServiceRequest } from '@shared/types/osi/services';
import { instance } from '@shared/api/config';
import { path } from '../config';

export const editOsiService = (id: number, payload: OsiServiceRequest) => instance.put(`${path}/${id}`, payload);
