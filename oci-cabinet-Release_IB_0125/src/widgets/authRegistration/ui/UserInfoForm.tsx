import { observer } from 'mobx-react-lite';
import { Controller, useForm } from 'react-hook-form';
import { UserInfo, UserInfoSchema } from '@widgets/authRegistration/config/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { RegistrationWidgetViewModel } from '@widgets/authRegistration/model/viewModel';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import { Box, Card, CardActions, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import MaskInput from '@shared/common/MaskInput';
import { getHelperText } from '@widgets/authRegistration/utils/helpers';
import { LoadingButton } from '@mui/lab';
import { formatPhone } from '@shared/utils/helpers/formatString';

const FormWrapperStyled = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.spacing(2),
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1)
}));

interface Props {
  viewModel: RegistrationWidgetViewModel;
}

export const UserInfoForm: React.FC<Props> = observer(({ viewModel }) => {
  const { translateToken: tt } = useTranslation();
  const hookForm = useForm<UserInfo>({
    resolver: yupResolver(UserInfoSchema),
    defaultValues: {
      fio: '',
      phone: formatPhone(viewModel.phone) || ''
    }
  });

  const {
    control,
    formState: { errors, touchedFields, isSubmitting, isValid },
    handleSubmit
  } = hookForm;

  return (
    <Card sx={{ p: 3 }}>
      <form onSubmit={handleSubmit(viewModel.onUserInfoSubmit)}>
        <FormWrapperStyled>
          <Controller
            name={'fio'}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                size={'small'}
                fullWidth
                label={tt(tokens.common.formFields.fio.label)}
                error={Boolean(touchedFields.fio && errors.fio)}
                helperText={tt(getHelperText({ isTouched: touchedFields.fio, error: errors.fio }))}
              />
            )}
          />
          <Controller
            name={'phone'}
            control={control}
            render={({ field }) => (
              <MaskInput
                {...field}
                required
                size={'small'}
                mask="+7 7## ### ## ##"
                label={tt(tokens.common.formFields.phone.label)}
                error={Boolean(touchedFields.phone && errors.phone)}
                helperText={tt(getHelperText({ isTouched: touchedFields.phone, error: errors.phone }))}
              />
            )}
          />
        </FormWrapperStyled>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <LoadingButton type={'submit'} variant="contained" loading={isSubmitting} disabled={!isValid}>
            <TranslatedToken id={tokens.common.save} />
          </LoadingButton>
        </CardActions>
      </form>
    </Card>
  );
});
