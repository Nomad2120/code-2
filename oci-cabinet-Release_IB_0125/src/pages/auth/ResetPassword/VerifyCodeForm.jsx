import { useState, useRef, useEffect } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, Alert, OutlinedInput, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
// routes
// hooks
import useIsMountedRef from '../../../shared/hooks/useIsMountedRef';
//
import maxLengthCheck from '../../../shared/utils/helpers/maxLengthCheck';
import api from '../../../app/api';

// ----------------------------------------------------------------------

const OutlinedInputStyled = styled(OutlinedInput)(({ theme }) => ({
  width: 36,
  height: 36,
  padding: 0,
  [theme.breakpoints.up('sm')]: {
    width: 56,
    height: 56
  },
  '& .MuiInputBase-input': {
    textAlign: 'center'
  }
}));
const VerifyCodeSchema = Yup.object().shape({
  code1: Yup.number().required('Code is required'),
  code2: Yup.number().required('Code is required'),
  code3: Yup.number().required('Code is required'),
  code4: Yup.number().required('Code is required'),
  code5: Yup.number().required('Code is required'),
  code6: Yup.number().required('Code is required')
});

VerifyCodeForm.propTypes = {
  phone: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default function VerifyCodeForm({ phone, onSuccess }) {
  const isMountedRef = useIsMountedRef();
  const [focus, setFocus] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [focus]);

  const formik = useFormik({
    initialValues: {
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      code5: '',
      code6: ''
    },
    validationSchema: VerifyCodeSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        const verifyCode = Object.values(values).reduce((str, item) => (str += item), '');
        const resp = await api.AuthVerifyCode(phone, verifyCode);
        if (!resp) throw new Error('Network error');
        const { userId } = resp;
        if (!userId) throw new Error('Пользователь не авторизован');
        onSuccess(userId, verifyCode);
      } catch (err) {
        if (err.name) err.name = '';
        if (isMountedRef.current) {
          setErrors({ afterSubmit: err.toString() });
          setSubmitting(false);
        }
      }
    }
  });

  const {
    values,
    errors,
    // touched,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setValues
  } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        {errors.afterSubmit && (
          <Alert sx={{ mb: 2 }} severity="error">
            {errors.afterSubmit}
          </Alert>
        )}
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            {Object.keys(values).map((item, idx) => (
              <Stack key={item} sx={{ mx: 1 }}>
                <OutlinedInputStyled
                  {...getFieldProps(item)}
                  onChange={(e) => {
                    setValues({ ...values, [item]: e.target.value });
                    if (idx < 6) setFocus(idx + 1);
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 8 && focus > 0) {
                      setFocus(idx - 1);
                    }
                  }}
                  onFocus={() => {
                    if (!values[item]) return;
                    const newValues = { ...values };
                    Object.keys(newValues).forEach((x) => {
                      if (x !== 'phone' && x !== 'remember' && x >= item) newValues[x] = '';
                    });
                    setValues(newValues);
                  }}
                  type="password"
                  inputRef={(el) => {
                    if (idx === focus) inputRef.current = el;
                  }}
                  placeholder="-"
                  onInput={maxLengthCheck}
                  inputProps={{ maxLength: 1 }}
                />
              </Stack>
            ))}
          </Box>
        </Stack>

        <LoadingButton
          sx={{ mt: 2 }}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={values.code1 === '' || !isEmpty(errors)}
        >
          Проверить
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
