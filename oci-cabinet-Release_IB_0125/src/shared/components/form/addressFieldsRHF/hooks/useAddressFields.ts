import { useLocalObservable } from 'mobx-react-lite';
import { useForm, UseFormReturn } from 'react-hook-form';
import { AddressFieldsViewModel } from '@shared/components/form/addressFields/model/AddressFieldsViewModel';
import { selectAddressFieldsSchema } from '@shared/validation/osi/services';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { initialValues } from '@mobx/services/osiModule/config';

interface AddressFields {
  city: any;
  street: any;
  building: any;
}

interface UseAddressFieldsProps {
  hookForm: UseFormReturn<any, any, undefined>;
}

export const useAddressFields = ({ hookForm }: UseAddressFieldsProps) => {
  const vm = useLocalObservable(() => new AddressFieldsViewModel({ form: hookForm }));

  return { hookForm, vm };
};
