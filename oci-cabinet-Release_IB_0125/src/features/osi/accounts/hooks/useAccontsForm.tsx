import { useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AccountSchema } from '@shared/validation/osi/accounts';
import { AccountForm } from '@shared/types/osi/accounts';

interface UseAccountsFormReturn {
  form: UseFormReturn<AccountForm>;
}

interface UseAccountsFormProps {
  defaultValues: AccountForm;
}

type UseAccountsForm = (props: UseAccountsFormProps) => UseAccountsFormReturn;

export const useAccountsForm: UseAccountsForm = ({ defaultValues }) => {
  const form = useForm<AccountForm>({
    defaultValues,
    resolver: yupResolver(AccountSchema),
    mode: 'all'
  });

  return { form };
};
