import * as Yup from 'yup';
import { tokens } from '@shared/utils/i18n';

export const RegistrationFormEditSchema = Yup.object().shape({
  // address: Yup.string().required('Укажите адрес'),
  arInfo: Yup.object().shape({
    ats: Yup.object().required(tokens.common.formFields.ats.validation.need).nullable(),
    geonim: Yup.object().required(tokens.common.formFields.geonim.validation.need).nullable(),
    building: Yup.object().required(tokens.common.formFields.building.validation.need).nullable()
  }),
  fio: Yup.string().required(tokens.common.formFields.fioChairman.validation.need),
  name: Yup.string().required(tokens.common.formFields.osiName.validation.need),
  idn: Yup.string()
    .min(12, tokens.common.formFields.IDNOSI.validation.tooShort)
    .max(12, tokens.common.formFields.IDNOSI.validation.error)
    .required(tokens.common.formFields.IDNOSI.validation.need),
  phone: Yup.string()
    .min(16, tokens.common.formFields.phone.validation.tooShort)
    .max(16, tokens.common.formFields.phone.validation.error)
    .required(tokens.common.formFields.phone.validation.need),
  email: Yup.string().email(tokens.common.formFields.email.validation.error),
  apartCount: Yup.number()
    .min(2, tokens.common.formFields.flatCount.validation.tooShort)
    .max(9999, tokens.common.formFields.flatCount.validation.tooBig)
    .required(tokens.common.formFields.flatCount.validation.need),
  unionTypeId: Yup.number().required(tokens.common.formFields.unionType.validation.need)
});
