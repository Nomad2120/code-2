import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { OsiInfoSchema } from '@shared/validation/osi/info';
import { useEffect } from 'react';

interface UseOsiInfoProps {
  defaultValues: any;
  autoTrigger?: boolean;
}

interface UseOsiInfoReturn {
  hookForm: any;
}

type UseOsiInfoForm = (props: UseOsiInfoProps) => UseOsiInfoReturn;

export const useOsiInfoForm: UseOsiInfoForm = ({ defaultValues, autoTrigger = true }) => {
  const hookForm = useForm({
    defaultValues,
    resolver: yupResolver(OsiInfoSchema),
    mode: 'all'
  });

  const { trigger } = hookForm;

  useEffect(() => {
    if (autoTrigger) {
      trigger();
    }
  }, [autoTrigger, trigger]);

  return {
    hookForm
  };
};
