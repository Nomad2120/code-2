import * as Yup from 'yup';
import { tokens } from '@shared/utils/i18n';
import { checkBIN, checkIIN } from '@shared/utils/helpers/validation/validateIDN';

export const RegistrationFormEditSchema = Yup.object().shape({
  arInfo: Yup.object().shape({
    city: Yup.object()
      .shape({
        id: Yup.number()
      })
      .required('common:addressFields.city.validation.need')
      .typeError('common:addressFields.city.validation.need')
      .default(''),
    street: Yup.object()
      .shape({
        id: Yup.number()
      })
      .required('common:addressFields.street.validation.need')
      .typeError('common:addressFields.city.validation.need')
      .default(''),
    building: Yup.object()
      .shape({
        id: Yup.number()
      })
      .required('common:addressFields.building.validation.need')
      .typeError('common:addressFields.building.validation.need')
      .default('')
  }),
  fio: Yup.string().required(tokens.common.formFields.fioChairman.validation.need),
  name: Yup.string().required(tokens.common.formFields.osiName.validation.need),
  idn: Yup.string().test(
    'idn-test',
    (d) => tokens.common.formFields.IDNOSI.validation.error,
    (value) => checkIIN(value as string) || checkBIN(value as string)
  ),
  phone: Yup.string()
    .min(16, tokens.common.formFields.phone.validation.tooShort)
    .max(16, tokens.common.formFields.phone.validation.error)
    .required(tokens.common.formFields.phone.validation.need),
  email: Yup.string().email(tokens.common.formFields.email.validation.error),
  apartCount: Yup.number()
    .min(2, tokens.common.formFields.flatCount.validation.tooShort)
    .max(9999, tokens.common.formFields.flatCount.validation.tooBig)
    .required(tokens.common.formFields.flatCount.validation.need)
    .typeError(tokens.common.formFields.flatCount.validation.need),
  unionTypeId: Yup.number()
    .required(tokens.common.formFields.unionType.validation.need)
    .typeError(tokens.common.formFields.unionType.validation.need)
});
