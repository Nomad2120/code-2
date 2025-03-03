import * as Yup from 'yup';
import { checkBIN, checkIIN } from '@shared/utils/helpers/validation/validateIDN';

export const serviceSchema = Yup.object().shape({
  service: Yup.object()
    .shape({
      nameRu: Yup.string().required('accruals:validation.name.required'),
      code: Yup.string()
    })
    .required('accruals:validation.name.required')
    .typeError('accruals:validation.name.required')
    .default(null),
  accrualMethodId: Yup.number().nullable(true).required('accruals:validation.accrualMethod.required'),
  amount: Yup.number()
    .positive('accruals:validation.tariff.mustBePositive')
    .required('accruals:validation.tariff.required')
    .typeError('accruals:validation.tariff.required')
});

export const additionalServiceSchema = Yup.object().shape({
  service: Yup.object()
    .shape({
      nameRu: Yup.string().required('accruals:validation.name.required'),
      code: Yup.string()
    })
    .required('accruals:validation.name.required')
    .typeError('accruals:validation.name.required')
    .default(null),
  amount: Yup.number()
    .positive('accruals:validation.tariff.mustBePositive')
    .required('accruals:validation.tariff.required')
    .typeError('accruals:validation.tariff.required'),
  arendator: Yup.object()
    .shape({
      value: Yup.object().default(null).nullable().required('accruals:validation.arendator.required'),
      inputValue: Yup.string()
    })
    .required('accruals:validation.arendator.required')
    .typeError('accruals:validation.arendator.required')
    .default(null)
});

export const addExternalAbonentSchema = Yup.object().shape({
  name: Yup.string().required('accruals:validation.external.name.required'),
  phone: Yup.string()
    .min(16, 'accruals:validation.external.phone.short')
    .max(16, 'accruals:validation.external.phone.error')
    .required('accruals:validation.external.phone.required'),
  bin: Yup.string()
    .test(
      'idn-test',
      (d) => 'accruals:validation.external.bin.error',
      (value) => checkIIN(value as string) || checkBIN(value as string)
    )
    .required('accruals:validation.external.bin.required'),
  flat: Yup.string().required('accruals:validation.external.flat.required')
});

export const selectAddressFieldsSchema = Yup.object().shape({
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
});
