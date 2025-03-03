import * as Yup from 'yup';
import { tokens } from '@shared/utils/i18n';
import { checkBIN, checkIIN } from '@shared/utils/helpers/validation/validateIDN';

export const AbonentSchema = Yup.object().shape({
  flat: Yup.string().required(tokens.common.formFields.flat.validation.need),
  name: Yup.string(),
  idn: Yup.string()
    .test(
      'idn-test',
      () => tokens.common.formFields.IDNOSI.validation.error,
      (value) => checkIIN(value as string) || checkBIN(value as string) || !value
    )
    .notRequired(),
  phone: Yup.string()
    .min(16, tokens.common.formFields.phone.validation.tooShort)
    .max(16, tokens.common.formFields.phone.validation.error),
  floor: Yup.number(),
  areaTypeCode: Yup.string().required(tokens.common.formFields.flatType.validation.need),
  square: Yup.number()
    .required(tokens.common.formFields.square.validation.need)
    .min(1, tokens.common.formFields.square.validation.need),
  effectiveSquare: Yup.number(),
  livingJur: Yup.number(),
  livingFact: Yup.number()
});
