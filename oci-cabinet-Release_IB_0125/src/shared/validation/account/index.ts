import * as Yup from 'yup';
import { tokens } from '@shared/utils/i18n';

export const UpdateUserSchema = Yup.object().shape({
  fio: Yup.string().required(tokens.common.formFields.fio.validation.need),
  iin: Yup.string()
    .min(12, tokens.common.formFields.iin.validation.tooShort)
    .max(12, tokens.common.formFields.iin.validation.error)
    .required(tokens.common.formFields.iin.validation.need),
  phone: Yup.string()
    .min(16, tokens.common.formFields.phone.validation.tooShort)
    .max(16, tokens.common.formFields.phone.validation.error),
  email: Yup.string().email(tokens.common.formFields.email.validation.error)
});
export const ChangePassWordSchema = Yup.object().shape({
  oldPassword1: Yup.number().required('Code is required'),
  oldPassword2: Yup.number().required('Code is required'),
  oldPassword3: Yup.number().required('Code is required'),
  oldPassword4: Yup.number().required('Code is required'),
  oldPassword5: Yup.number().required('Code is required'),
  oldPassword6: Yup.number().required('Code is required'),
  newPassword1: Yup.number().required('Code is required'),
  newPassword2: Yup.number().required('Code is required'),
  newPassword3: Yup.number().required('Code is required'),
  newPassword4: Yup.number().required('Code is required'),
  newPassword5: Yup.number().required('Code is required'),
  newPassword6: Yup.number().required('Code is required'),
  confirmPassword1: Yup.number().required('Code is required'),
  confirmPassword2: Yup.number().required('Code is required'),
  confirmPassword3: Yup.number().required('Code is required'),
  confirmPassword4: Yup.number().required('Code is required'),
  confirmPassword5: Yup.number().required('Code is required'),
  confirmPassword6: Yup.number().required('Code is required')
});
