import { useLocalObservable } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { AddressFieldsViewModel } from '@shared/components/form/addressFields/model/AddressFieldsViewModel';
import { selectAddressFieldsSchema } from '@shared/validation/osi/services';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

interface AddressFields {
  city: any;
  street: any;
  building: any;
}

interface UseAddressFieldsProps {
  initialValues?: AddressFields;
}

export const useAddressFields = ({ initialValues }: UseAddressFieldsProps) => {
  const form = useForm<AddressFields>({
    defaultValues: initialValues,
    resolver: yupResolver(selectAddressFieldsSchema),
    mode: 'all'
  });

  const vm = useLocalObservable(() => new AddressFieldsViewModel({ form }));

  return { form, vm };
};
