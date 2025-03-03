import * as Yup from 'yup';
import { tokens } from '@shared/utils/i18n';

export const ServiceCompanySchema = Yup.object().shape({
  code: Yup.string().required(tokens.common.formFields.companyType.validation.need),
  phones: Yup.string().required(tokens.common.formFields.phone.validation.need),
  addresses: Yup.string().required(tokens.common.formFields.address.validation.need)
});
