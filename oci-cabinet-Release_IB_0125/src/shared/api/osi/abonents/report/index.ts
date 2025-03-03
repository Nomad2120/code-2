import { instance } from '@shared/api/config';
import { DOC_PATH } from '@shared/api/paths';

export const getOsiAbonentsReport = (osiId: number) => instance.get(`${DOC_PATH}/report/abonents/${osiId}`);
