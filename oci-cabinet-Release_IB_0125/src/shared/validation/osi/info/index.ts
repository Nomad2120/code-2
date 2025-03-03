import * as Yup from 'yup';
import { tokens } from '@shared/utils/i18n';
import { checkBIN, checkIIN } from '@shared/utils/helpers/validation/validateIDN';

const curDate = new Date();
const curYear = curDate.getFullYear();
export const OsiInfoSchema = Yup.object().shape({
  name: Yup.string().required(tokens.common.formFields.osiName.validation.need),
  fio: Yup.string().required(tokens.common.formFields.fioChairman.validation.need),
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
  floors: Yup.number()
    .transform((value) => {
      if (typeof value === 'string' && value === '') return null;
      if (Number.isNaN(value)) return null;
      return value;
    })
    .min(0, tokens.common.formFields.floorCount.validation.error)
    .max(100, tokens.common.formFields.floorCount.validation.max)
    .nullable(true)
    .required(tokens.common.formFields.floorCount.validation.need)
});
