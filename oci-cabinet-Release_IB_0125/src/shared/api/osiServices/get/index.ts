import { instance } from '@shared/api/config';
import { OsiService } from '@shared/types/osi/services';
import { path } from '../config';

export const getOsiServiceById = (id: number): Promise<OsiService> => instance.get(`${path}/${id}`);
