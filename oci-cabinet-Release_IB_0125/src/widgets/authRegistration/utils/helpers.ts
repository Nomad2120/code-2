import { replace } from 'lodash';
import { FieldError } from 'react-hook-form';

export const preparePhone = (phone: string) => replace(replace(phone, '+7 7', '7'), new RegExp(' ', 'g'), '');

interface GetHelperTextParams {
  isTouched: boolean | undefined;
  error: FieldError | undefined;
}

export const getHelperText = (params: GetHelperTextParams): string => {
  if (!params.isTouched) return '';

  if (!params.error?.message) return '';

  return params.error.message;
};
