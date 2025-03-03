import { useInjection } from 'inversify-react';
import {
  IAccountChangePasswordWidgetViewModel,
  IAccountChangePasswordWidgetViewModelToken
} from '@shared/types/mobx/widgets/AccountChangePassword';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import notistack from '@shared/utils/helpers/notistackExternal';
import { Card, OutlinedInput, Stack, Typography } from '@mui/material';
import { tokens, TranslatedToken } from '@shared/utils/i18n';
import maxLengthCheck from '@shared/utils/helpers/maxLengthCheck';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { ChangePassWordSchema } from '@shared/validation/account';

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

export const AccountChangePasswordWidget: React.FC = observer(() => {
  const vm = useInjection<IAccountChangePasswordWidgetViewModel>(IAccountChangePasswordWidgetViewModelToken);
  const [focus, setFocus] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [focus]);

  const formik = useFormik({
    initialValues: {
      oldPassword1: '',
      oldPassword2: '',
      oldPassword3: '',
      oldPassword4: '',
      oldPassword5: '',
      oldPassword6: '',
      newPassword1: '',
      newPassword2: '',
      newPassword3: '',
      newPassword4: '',
      newPassword5: '',
      newPassword6: '',
      confirmPassword1: '',
      confirmPassword2: '',
      confirmPassword3: '',
      confirmPassword4: '',
      confirmPassword5: '',
      confirmPassword6: ''
    },
    validationSchema: ChangePassWordSchema,
    validate: (values: any) => {
      const errors: any = {};
      const newPassword = Object.keys(values)
        .filter((x) => x.substr(0, 11) === 'newPassword')
        .reduce((str, item: any) => (str += values[item]), '');
      const confirmPassword = Object.keys(values)
        .filter((x) => x.substr(0, 15) === 'confirmPassword')
        .reduce((str, item: any) => (str += values[item]), '');
      if (newPassword.length === 6 && confirmPassword.length === 6 && newPassword !== confirmPassword) {
        errors.compare = 'Пароли не совпадают';
        Object.keys(values)
          .filter((x) => x.substr(0, 15) === 'confirmPassword')
          .forEach((x) => {
            errors[x] = 'Repeat not equal code';
          });
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await vm.changePassword(values);
        notistack.success('Новый пароль установлен');
      } catch (err: any) {
        notistack.error(err.toString());
        setSubmitting(false);
      } finally {
        formik.resetForm();
      }
    }
  });

  const { values, errors, isSubmitting, handleSubmit, getFieldProps, setValues } = formik;

  return (
    <Card sx={{ p: 3, maxWidth: 480 }}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Typography color="textSecondary">
            <TranslatedToken id={tokens.cabinetRoot.user.oldPassword} />
          </Typography>
          <Stack direction="row" spacing={2}>
            {Object.keys(values)
              .filter((x) => x.substr(0, 11) === 'oldPassword')
              .map((item: string, idx) => (
                <OutlinedInputStyled
                  key={`1${idx}`}
                  {...getFieldProps(item)}
                  onChange={(e) => {
                    setValues({ ...values, [item]: e.target.value });
                    if (idx < 6) setFocus(idx + 1);
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 8 && focus > 0) {
                      setFocus(focus - 1);
                    }
                  }}
                  onFocus={() => {
                    // @ts-expect-error-next-line
                    if (!values[item]) return;
                    const newValues = { ...values };
                    Object.keys(newValues).forEach((x) => {
                      // @ts-expect-error-next-line
                      if (x.substr(0, 11) === item.substr(0, 11) && x >= item) newValues[x] = '';
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
                  // @ts-expect-error-next-line
                  error={Boolean(errors.afterSubmit)}
                />
              ))}
          </Stack>

          <Typography sx={{ mt: 2 }} color="textSecondary">
            <TranslatedToken id={tokens.cabinetRoot.user.newPassword} />
          </Typography>
          <Stack direction="row" spacing={2}>
            {Object.keys(values)
              .filter((x) => x.substr(0, 11) === 'newPassword')
              .map((item, idx) => (
                <OutlinedInputStyled
                  key={`2${idx}`}
                  {...getFieldProps(item)}
                  onChange={(e) => {
                    setValues({ ...values, [item]: e.target.value });
                    if (idx < 6) setFocus(idx + 6 + 1);
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 8) {
                      setFocus(focus - 1);
                    }
                  }}
                  onFocus={() => {
                    // @ts-expect-error-next-line
                    if (!values[item]) return;
                    const newValues = { ...values };
                    Object.keys(newValues).forEach((x) => {
                      // @ts-expect-error-next-line
                      if (x.substr(0, 11) === item.substr(0, 11) && x >= item) newValues[x] = '';
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
                  // @ts-expect-error-next-line
                  error={Boolean(errors.afterSubmit)}
                />
              ))}
          </Stack>
          <Typography sx={{ mt: 2 }} color="textSecondary">
            <TranslatedToken id={tokens.cabinetRoot.user.repeatNewPassword} />
          </Typography>
          <Stack direction="row" spacing={2}>
            {Object.keys(values)
              .filter((x) => x.substr(0, 15) === 'confirmPassword')
              .map((item, idx) => (
                <OutlinedInputStyled
                  key={`3${idx}`}
                  {...getFieldProps(item)}
                  onChange={(e) => {
                    setValues({ ...values, [item]: e.target.value });
                    if (idx < 6) setFocus(idx + 12 + 1);
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 8) {
                      setFocus(focus - 1);
                    }
                  }}
                  onFocus={() => {
                    // @ts-expect-error-next-line
                    if (!values[item]) return;
                    const newValues = { ...values };
                    Object.keys(newValues).forEach((x) => {
                      // @ts-expect-error-next-line
                      if (x.substr(0, 15) === item.substr(0, 15) && x >= item) newValues[x] = '';
                    });
                    setValues(newValues);
                  }}
                  type="password"
                  inputRef={(el) => {
                    if (idx + 12 === focus) inputRef.current = el;
                  }}
                  placeholder="-"
                  onInput={maxLengthCheck}
                  inputProps={{ maxLength: 1 }}
                  // @ts-expect-error-next-line
                  error={Boolean(errors.compare)}
                />
              ))}
          </Stack>
          <LoadingButton sx={{ mt: 3, width: '100%' }} type="submit" variant="contained" loading={isSubmitting}>
            <TranslatedToken id={tokens.common.save} />
          </LoadingButton>
        </Form>
      </FormikProvider>
    </Card>
  );
});
