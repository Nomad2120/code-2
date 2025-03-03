import { instance } from '@shared/api/config';
import { Act, ActDoc } from '@shared/types/osi/acts';
import { CORE_PATH, DOC_PATH } from '@shared/api/paths';

const MAIN_PATH = 'Acts';

const path = `${CORE_PATH}/${MAIN_PATH}`;

export const getSignedActsByOsiId = async (osiId: number): Promise<Act[]> =>
  instance.get(`${CORE_PATH}/Osi/${osiId}/signed-acts`);

export const getNotSignedActsByOsiId = async (osiId: number): Promise<Act[]> =>
  instance.get(`${CORE_PATH}/Osi/${osiId}/not-signed-acts`);

export const getDocsByActId = async (actId: number): Promise<ActDoc[]> => instance.get(`${path}/${actId}/docs`);

// TODO: add to shared api slice
export const getBase64ByScanId = async (id: number): Promise<string> => instance.get(`${CORE_PATH}/Scans/${id}`);

export const getWorkCompletionAct = async (
  actId: number
): Promise<{
  pdfBase64: string;
}> => instance.get(`${DOC_PATH}/act/work-completion/${actId}`);

export const saveSignedWorkCompletionAct = async (
  actId: number,
  data: string
): Promise<{
  pdfBase64: string;
}> => instance.put(`${DOC_PATH}/act/work-completion/${actId}/sign?extension=pdf`, data);
