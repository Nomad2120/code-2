import { useState, useRef, useEffect } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, Alert, OutlinedInput, Box, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
// routes
// hooks
import useIsMountedRef from '../../../shared/hooks/useIsMountedRef';
//
import maxLengthCheck from '../../../shared/utils/helpers/maxLengthCheck';
import api from '../../../app/api';
import notistack from '../../../shared/utils/helpers/notistackExternal';

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

const ChangePasswordSchema = Yup.object().shape({
  code1: Yup.number().required('Code is required'),
  code2: Yup.number().required('Code is required'),
  code3: Yup.number().required('Code is required'),
  code4: Yup.number().required('Code is required'),
  code5: Yup.number().required('Code is required'),
  code6: Yup.number().required('Code is required'),
  repeat1: Yup.number().required('Code is required'),
  repeat2: Yup.number().required('Code is required'),
  repeat3: Yup.number().required('Code is required'),
  repeat4: Yup.number().required('Code is required'),
  repeat5: Yup.number().required('Code is required'),
  repeat6: Yup.number().required('Code is required')
});

ChangePasswordForm.propTypes = {
  userId: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default function ChangePasswordForm({ userId, onSuccess }) {
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
      code6: '',
      repeat1: '',
      repeat2: '',
      repeat3: '',
      repeat4: '',
      repeat5: '',
      repeat6: ''
    },
    validationSchema: ChangePasswordSchema,
    validate: (values) => {
      const errors = {};
      const code = Object.keys(values)
        .filter((x) => x.substr(0, 4) === 'code')
        .reduce((str, item) => (str += values[item]), '');
      const repeat = Object.keys(values)
        .filter((x) => x.substr(0, 4) !== 'code')
        .reduce((str, item) => (str += values[item]), '');
      if (code.length === 6 && repeat.length === 6 && code !== repeat) {
        errors.compare = 'Пароли не совпадают';
        Object.keys(values)
          .filter((x) => x.substr(0, 4) !== 'code')
          .forEach((x) => {
            errors[x] = 'Repeat not equal code';
          });
      }
      return errors;
    },
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        const code = Object.keys(values)
          .filter((x) => x.substr(0, 4) === 'code')
          .reduce((str, item) => (str += values[item]), '');
        await api.UsersSetPassword(userId, code);
        notistack.success('Регисрация завершена');
        onSuccess();
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
        {(errors.compare || errors.afterSubmit) && (
          <Alert sx={{ mb: 2 }} severity="error">
            {errors.compare || errors.afterSubmit}
          </Alert>
        )}
        <Stack spacing={2}>
          <Typography color="textSecondary">Новый пароль</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {Object.keys(values)
              .filter((x) => x.substr(0, 4) === 'code')
              .map((item, idx) => (
                <Box key={item} sx={{ mx: 1 }}>
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
                        if (x.substr(0, 4) === item.substr(0, 4) && x >= item) newValues[x] = '';
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
                </Box>
              ))}
          </Box>
          <Typography color="textSecondary">Повторите пароль</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {Object.keys(values)
              .filter((x) => x.substr(0, 4) !== 'code')
              .map((item, idx) => (
                <Box key={item} sx={{ mx: 1 }}>
                  <OutlinedInputStyled
                    {...getFieldProps(item)}
                    onChange={(e) => {
                      setValues({ ...values, [item]: e.target.value });
                      if (idx + 6 < 12) setFocus(idx + 6 + 1);
                    }}
                    onKeyDown={(e) => {
                      if (e.keyCode === 8) {
                        setFocus(idx - 1);
                      }
                    }}
                    onFocus={() => {
                      if (!values[item]) return;
                      const newValues = { ...values };
                      Object.keys(newValues).forEach((x) => {
                        if (x.substr(0, 4) === item.substr(0, 4) && x >= item) newValues[x] = '';
                      });
                      setValues(newValues);
                    }}
                    type="password"
                    inputRef={(el) => {
                      if (idx + 6 === focus) inputRef.current = el;
                    }}
                    placeholder="-"
                    onInput={maxLengthCheck}
                    inputProps={{ maxLength: 1 }}
                  />
                </Box>
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
