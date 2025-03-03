import { CORE_PATH } from '@shared/api/paths';
import { instance } from '@shared/api/config';
import { Registration, RegistrationDoc, RequiredDocsResponse } from '@shared/types/registration';

const MAIN_PATH = 'Registrations';

export const path = `${CORE_PATH}/${MAIN_PATH}`;

export const signWithoutDoc = (regId: number): Promise<void> => instance.put(`${path}/${regId}/sign-wo-doc`);

export const updateWizardStep = (regId: number, step: string): Promise<void> =>
  instance.put(`${path}/${regId}/wizard-step`, step.toString(), {
    headers: {
      'Content-Type': 'text/plain'
    }
  });

export const getRequiredDocsByRegistrationId = (regId: number): Promise<RequiredDocsResponse[]> =>
  instance.get(`${path}/reqdocs?registrationId=${regId}`);

export const getDocsByRegistrationId = (regId: number): Promise<RegistrationDoc[]> =>
  instance.get(`${path}/${regId}/docs`);

export const getRegistrationById = (regId: number): Promise<Registration> => instance.get(`${path}/${regId}`);

export const confirmCreationRegistration = (regId: number): Promise<void> =>
  instance.put(`${path}/${regId}/confirm-creation`);
