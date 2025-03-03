import {
  IAccountGeneralWidgetViewModel,
  IAccountGeneralWidgetViewModelToken
} from '@shared/types/mobx/widgets/AccountGeneral';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import { Form, FormikProvider, useFormik } from 'formik';
import { formatPhone } from '@shared/utils/helpers/formatString';
import { isEmpty } from 'lodash';
import { Box, Card, Grid, Stack, TextField } from '@mui/material';
import MaskInput from '@shared/common/MaskInput';
import { LoadingButton } from '@mui/lab';
import { UpdateUserSchema } from '@shared/validation/account';

export const AccountGeneralWidget: React.FC = observer(() => {
  const vm = useInjection<IAccountGeneralWidgetViewModel>(IAccountGeneralWidgetViewModelToken);
  const { translateToken: tt } = useTranslation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fio: (vm.user && vm.user.fio) || '',
      iin: (vm.user && vm.user.iin) || '',
      phone: formatPhone(vm.user && vm.user.phone) || '',
      email: (vm.user && vm.user.email) || ''
    },

    validationSchema: UpdateUserSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      vm.onSubmit(values, { setErrors, setSubmitting });
    }
  });

  const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3} sx={{ maxWidth: 503 }}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={{ xs: 2, md: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    size={'small'}
                    label={tt(tokens.common.formFields.fio.label)}
                    {...getFieldProps('fio')}
                    error={Boolean(touched.fio && errors.fio)}
                    // @ts-expect-error-next-line not typed
                    helperText={touched.fio && tt(errors.fio)}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <MaskInput
                    size={'small'}
                    label={tt(tokens.common.formFields.iin.label)}
                    mask="############"
                    error={Boolean(touched.iin && errors.iin)}
                    // @ts-expect-error-next-line not typed
                    helperText={touched.iin && tt(errors.iin)}
                    {...getFieldProps('iin')}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <MaskInput
                    size={'small'}
                    mask="+7 7## ### ## ##"
                    label={tt(tokens.common.formFields.phone.label)}
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    // @ts-expect-error-next-line not typed
                    helperText={touched.phone && tt(errors.phone)}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    size={'small'}
                    fullWidth
                    label={tt(tokens.common.formFields.email.label)}
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    // @ts-expect-error-next-line not typed
                    helperText={touched.email && tt(errors.email)}
                  />
                </Stack>
              </Stack>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  disabled={values.iin === '' || !isEmpty(errors)}
                >
                  <TranslatedToken id={tokens.common.save} />
                </LoadingButton>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
});
