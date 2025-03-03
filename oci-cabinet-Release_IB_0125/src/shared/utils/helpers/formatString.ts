import { replace as _replace } from 'lodash';

export const formatPhone = (phone: any) => {
  if (typeof phone !== 'string') return phone;
  if (phone.length !== 10) return phone;
  return `+7 7${phone.substr(1, 2)} ${phone.substr(3, 3)} ${phone.substr(6, 2)} ${phone.substr(8, 2)}`;
};

export const reformatPhone = (formattedPhone: any) => {
  if (typeof formattedPhone !== 'string') return formattedPhone;

  return _replace(_replace(formattedPhone, '+7 7', '7'), new RegExp(' ', 'g'), '');
};
