import { useForm, UseFormReturn } from 'react-hook-form';
import { OsiServiceCompanyForm } from '@shared/types/osi/osiServiceCompanies';
import { yupResolver } from '@hookform/resolvers/yup';
import { ServiceCompanySchema } from '@shared/validation/osi/serviceCompanies';

interface UseServiceCompanyFormPropsFormReturn {
  form: UseFormReturn<OsiServiceCompanyForm>;
}

interface UseServiceCompanyFormPropsFormProps {
  defaultValues: OsiServiceCompanyForm;
}

type UseServiceCompanyForm = (props: UseServiceCompanyFormPropsFormProps) => UseServiceCompanyFormPropsFormReturn;
export const useServiceCompanyForm: UseServiceCompanyForm = ({ defaultValues }) => {
  const form = useForm<OsiServiceCompanyForm>({
    defaultValues,
    resolver: yupResolver(ServiceCompanySchema),
    mode: 'all'
  });

  return { form };
};
