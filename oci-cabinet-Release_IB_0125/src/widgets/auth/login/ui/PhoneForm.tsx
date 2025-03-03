import * as Yup from 'yup';
import { get, isEmpty, replace } from 'lodash';
import { useCookies } from 'react-cookie';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { Alert, Checkbox, FormControlLabel, Link, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { PATH_AUTH } from '@app/routes/paths';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import useIsMountedRef from '@shared/hooks/useIsMountedRef';
import MaskInput from '@shared/common/MaskInput';
import api from '@app/api';
import notistack from '@shared/utils/helpers/notistackExternal';
import { useEffect } from 'react';

const PhoneSchema = Yup.object().shape({
  phone: Yup.string().min(16, 'Номер указан не полностью').max(16, 'Номер указан не верно').required('Номер не указан'),
  remember: Yup.boolean()
});

interface Props {
  onSuccess: (phone: string) => void;
  initialPhone?: string;
}

export const PhoneForm = ({ onSuccess, initialPhone }: Props): JSX.Element => {
  const { translateToken: tt } = useTranslation();
  const [cookies, setCookie] = useCookies(['user']);
  const navigate = useNavigate();
  const isMountedRef = useIsMountedRef();

  const formik = useFormik({
    initialValues: {
      phone: initialPhone || cookies.user || '',
      remember: true
    },
    validationSchema: PhoneSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        let { phone } = values;
        const { remember } = values;
        setCookie('user', remember ? values.phone : '', {
          path: '/'
        });
        // TODO: export to AuthModule
        phone = replace(replace(phone, '+7 7', '7'), new RegExp(' ', 'g'), '');
        const resp = await api.AuthCheckContact(phone);
        if (!resp) throw new Error('Network error');
        const { isRegistered, hasPassword } = resp as unknown as { isRegistered: any; hasPassword: any };
        setSubmitting(false);
        if (!isRegistered) {
          navigate(PATH_AUTH.register, { state: { isFreshRegistration: true, phone } });
          return;
        }
        if (!hasPassword) {
          if (!hasPassword) {
            notistack.success(tt(tokens.login.registrationNotFinished));
            navigate(PATH_AUTH.register);
            return;
          }
        }
        onSuccess(phone);
      } catch (err) {
        (err as any).name = '';
        if (isMountedRef.current) {
          setErrors({ afterSubmit: (err as any).toString() } as any);
          setSubmitting(false);
        }
      }
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, isValid } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {(errors as any).afterSubmit && <Alert severity="error">{(errors as any).afterSubmit}</Alert>}

          <MaskInput
            data-test-id={'login-phone'}
            label="Телефон"
            error={Boolean(touched.phone && errors.phone)}
            helperText={(touched.phone && errors.phone) as string}
            autoFocus
            mask="+7 7## ### ## ##"
            {...getFieldProps('phone')}
            type="tel"
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label={tt(tokens.common.rememberMe)}
          />

          <Link
            component={RouterLink}
            variant="subtitle2"
            to={PATH_AUTH.resetPassword}
            onClick={() => {
              setCookie('user', values.phone, {
                path: '/'
              });
            }}
          >
            <TranslatedToken id={tokens.common.forgetPassword} />
          </Link>
        </Stack>
        <LoadingButton
          data-test-id={'login-phone-check'}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={!isValid || get(values, ['phone']) === '' || !isEmpty(errors)}
        >
          <TranslatedToken id={tokens.common.check} />
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
};
