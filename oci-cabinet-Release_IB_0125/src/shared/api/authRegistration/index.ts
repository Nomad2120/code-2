import { instance } from '@shared/api/config';
import { UserContactResponse } from '@shared/types/authRegistration';
import { UserInfo } from '@widgets/authRegistration/config/validation';
import { CORE_PATH } from '@shared/api/paths';

const MAIN_PATH = 'Auth';

const path = `${CORE_PATH}/${MAIN_PATH}`;

export const checkContact = (phone: string): Promise<UserContactResponse> =>
  instance.get(`${path}/check-contact/${phone}`);

export const generateOtp = (phone: string): Promise<void> => instance.get(`${path}/generate-otp/${phone}`);

export const changeUserInfo = (userId: number, payload: UserInfo): Promise<void> =>
  instance.put(`${CORE_PATH}/Users/${userId}`, payload);
