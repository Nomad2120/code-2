import { useEffect, useRef, useState } from 'react';
import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
import { Alert, Box, OutlinedInput, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { tokens, TranslatedToken } from '@shared/utils/i18n';
import useIsMountedRef from '@shared/hooks/useIsMountedRef';
//
import maxLengthCheck from '@shared/utils/helpers/maxLengthCheck';

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

interface Props {
  onSuccess: (verifyCode: string) => void;
}

const VerifyCodeForm = ({ onSuccess }: Props) => {
  const isMountedRef = useIsMountedRef();
  const [focus, setFocus] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

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
        const verifyCode = Object.entries(values)
          .sort((a, b) => {
            if (a[0] < b[0]) {
              return -1;
            }
            if (a[0] > b[0]) {
              return 1;
            }
            return 0;
          })
          .map((e) => e[1])
          .join('');

        onSuccess(verifyCode);
      } catch (err: any) {
        if (err.name) err.name = '';
        if (isMountedRef.current) {
          const errors = { afterSubmit: err.toString() };
          setErrors(errors as any);
          setSubmitting(false);
        }
      }
    }
  });

  const { values, errors, isSubmitting, handleSubmit, getFieldProps, setValues } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        {(errors as any).afterSubmit && (
          <Alert sx={{ mb: 2 }} severity="error">
            {(errors as any).afterSubmit}
          </Alert>
        )}
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }} className={'!mb-6'}>
            {Object.keys(values).map((item, idx) => (
              <Stack key={item} sx={{ mx: 1 }}>
                <OutlinedInputStyled
                  data-test-id={`code-${idx}`}
                  {...getFieldProps(item)}
                  onChange={(e) => {
                    if (!/[0-9]/.test(e.target.value)) return;

                    setValues({ ...values, [item]: e.target.value });
                    if (idx < 6) setFocus(idx + 1);
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 8 && focus > 0) {
                      setFocus(idx - 1);
                    }
                  }}
                  onFocus={() => {
                    if (!(values as Record<string, string>)[item]) return;
                    const newValues = { ...values };
                    Object.keys(newValues).forEach((x) => {
                      if (x !== 'phone' && x !== 'remember' && x >= item) (newValues as Record<string, string>)[x] = '';
                    });
                    setValues(newValues);
                  }}
                  inputRef={(el) => {
                    if (idx === focus) (inputRef.current as HTMLInputElement) = el;
                  }}
                  placeholder="-"
                  onInput={maxLengthCheck}
                  type="password"
                  inputProps={{
                    maxLength: 1,
                    // type: 'password',
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  }}
                />
              </Stack>
            ))}
          </Box>
        </Stack>

        <LoadingButton
          data-test-id={'code-check'}
          sx={{ mt: 2 }}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={values.code1 === '' || !isEmpty(errors)}
        >
          <TranslatedToken id={tokens.common.check} />
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
};

export default VerifyCodeForm;
