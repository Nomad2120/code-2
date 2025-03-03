import * as Yup from 'yup';
import { tokens } from '@shared/utils/i18n';

export interface UserInfo {
  fio: string;
  phone: string;
}

export const UserInfoSchema = Yup.object().shape({
  fio: Yup.string().required(tokens.common.formFields.fio.validation.need),
  phone: Yup.string()
    .min(16, tokens.common.formFields.phone.validation.tooShort)
    .max(16, tokens.common.formFields.phone.validation.error)
    .required(tokens.common.formFields.phone.validation.need)
});
export const PhoneSchema = Yup.object().shape({
  phone: Yup.string().min(16, 'Номер указан не полностью').max(16, 'Номер указан не верно').required('Номер не указан')
});
