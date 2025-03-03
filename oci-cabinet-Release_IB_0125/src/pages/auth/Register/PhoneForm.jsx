import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { replace, get, isEmpty } from 'lodash';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
// hooks
import useIsMountedRef from '../../../shared/hooks/useIsMountedRef';
//
import MaskInput from '../../../shared/common/MaskInput';
import api from '../../../app/api';
import { TranslatedToken } from '../../../shared/utils/i18n/utils/components';
import { tokens } from '../../../shared/utils/i18n/messages';

// ----------------------------------------------------------------------

const PhoneSchema = Yup.object().shape({
  phone: Yup.string().min(16, 'Номер указан не полностью').max(16, 'Номер указан не верно').required('Номер не указан')
});

PhoneForm.propTypes = {
  onSuccess: PropTypes.func.isRequired
};

export default function PhoneForm({ onSuccess }) {
  const isMountedRef = useIsMountedRef();

  const formik = useFormik({
    initialValues: {
      phone: '+7 7'
    },
    validationSchema: PhoneSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        let { phone } = values;
        phone = replace(replace(phone, '+7 7', '7'), new RegExp(' ', 'g'), '');
        const resp = await api.AuthCheckContact(phone);
        if (!resp) throw new Error('Network error');
        const { isContacted, isRegistered, hasPassword } = resp;
        let { botUrl } = resp;
        if (isRegistered && hasPassword) {
          throw new Error('Пользователь уже зарегистрирован');
        }
        if (!isContacted && !botUrl) botUrl = 'http://t.me/OSITelegramBot';
        if (isContacted && !hasPassword) {
          api.AuthGenerateOtp(phone);
        }
        setSubmitting(false);
        onSuccess(phone, botUrl);
      } catch (err) {
        err.name = '';
        if (isMountedRef.current) {
          setErrors({ afterSubmit: err.toString() });
          setSubmitting(false);
        }
      }
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, disabled } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <MaskInput
            label="Телефон"
            error={Boolean(touched.phone && errors.phone)}
            helperText={touched.phone && errors.phone}
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
            disabled={disabled || get(values, ['phone']) === '' || !isEmpty(errors)}
          >
            <TranslatedToken id={tokens.common.check} />
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
