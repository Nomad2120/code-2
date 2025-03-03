import { get, isEmpty } from 'lodash';
import { Form, FormikHelpers, FormikProvider, useFormik } from 'formik';
import { Alert, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { tokens, TranslatedToken } from '@shared/utils/i18n';
import { observer } from 'mobx-react-lite';

import { PhoneSchema } from '@widgets/authRegistration/config/validation';
import { useEffect } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import MaskInput from '../../../shared/common/MaskInput';

interface Props {
  onSubmit: (phone: string, helpers: FormikHelpers<FormikValues>, navigate: NavigateFunction) => void;
  initialPhone?: string;
}

interface FormikValues {
  phone: string;
  afterSubmit?: string;
}

export const PhoneField: React.FC<Props> = observer(({ onSubmit, initialPhone }) => {
  const navigate = useNavigate();

  const formik = useFormik<FormikValues>({
    initialValues: {
      phone: initialPhone ?? '+7 7'
    },
    validationSchema: PhoneSchema,
    onSubmit: async (values, formikHelpers) => {
      onSubmit(values.phone, formikHelpers, navigate);
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const getHelperText = () => {
    if (Boolean(touched.phone) && errors.phone) return errors.phone?.toString();

    return null;
  };

  useEffect(() => {
    formik.setFieldValue('phone', initialPhone);
  }, [initialPhone]);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <MaskInput
            label="Телефон"
            error={Boolean(touched.phone && errors.phone)}
            helperText={getHelperText()}
            autoFocus
            mask="+7 7## ### ## ##"
            {...getFieldProps('phone')}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={get(values, ['phone']) === '' || !isEmpty(errors)}
          >
            <TranslatedToken id={tokens.common.check} />
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
});
