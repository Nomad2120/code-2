import * as Yup from 'yup';
import { tokens } from '@shared/utils/i18n';

export const CorrectionFormSchema = Yup.object().shape({
  abonent: Yup.object({
    id: Yup.number(),
    name: Yup.string().nullable().notRequired(),
    flat: Yup.string()
  })
    .required(tokens.common.formFields.room.validation.need)
    .nullable(),
  group: Yup.object({ id: Yup.number(), groupNameRu: Yup.string() })
    .required(tokens.common.formFields.serviceGroup.validation.need)
    .nullable(),
  service: Yup.object({ id: Yup.number(), nameRu: Yup.string() })
    .required(tokens.common.formFields.service.validation.need)
    .nullable(),
  amount: Yup.number()
    .required(tokens.common.formFields.sum.validation.need)
    .typeError(tokens.common.formFields.sum.validation.need),
  reason: Yup.string()
    .min(7, tokens.common.formFields.reason.validation.min)
    .required(tokens.common.formFields.reason.validation.need)
});
