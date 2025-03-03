import * as Yup from 'yup';
import { tokens } from '@shared/utils/i18n';

export const FormSchema = Yup.object().shape({
  abonent: Yup.object({
    id: Yup.number(),
    name: Yup.string().nullable().notRequired(),
    flat: Yup.string()
  })
    .required(tokens.common.formFields.flat.validation.need)
    .nullable(),
  group: Yup.object({
    id: Yup.number(),
    groupNameRu: Yup.string()
  })
    .required(tokens.common.formFields.serviceGroup.validation.need)
    .nullable(),
  amount: Yup.number().required(tokens.common.formFields.sum.validation.need),
  date: Yup.date().required(tokens.common.formFields.paymentDate.validation.need)
});
