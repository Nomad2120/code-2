import * as Yup from 'yup';
import { tokens } from '@shared/utils/i18n';

export const AccountSchema = Yup.object().shape({
  accountType: Yup.string().required(tokens.common.formFields.billType.validation.need),
  account: Yup.string()
    .min(20, tokens.common.formFields.bill.validation.tooShort)
    .max(20, tokens.common.formFields.bill.validation.error)
    .required(tokens.common.formFields.bill.validation.need),
  bank: Yup.object().shape({
    bic: Yup.string()
      .min(8, tokens.common.formFields.IDNBank.validation.tooShort)
      .max(8, tokens.common.formFields.IDNBank.validation.error)
      .required(tokens.common.formFields.IDNBank.validation.need),
    name: Yup.string()
  })
});
