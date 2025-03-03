import VerifyCodeForm from '@pages/auth/Register/VerifyCodeForm';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from '@shared/utils/i18n';
import { observer } from 'mobx-react-lite';
import { RegistrationWidgetViewModel } from '@widgets/authRegistration/model/viewModel';

interface Props {
  viewModel: RegistrationWidgetViewModel;
}

export const RegistrationVerifyCode: React.FC<Props> = observer(({ viewModel }) => {
  const { translateToken: tt, t } = useTranslation();

  const {
    phone,
    onSuccessVerifyCode,
    cancelRegistration,
    selectedVerifyMethod,
    verifySmsMethod,
    timerState: { isButtonDisabled, countdown }
  } = viewModel;

  return (
    <Box>
      <VerifyCodeForm phone={phone} onSuccess={onSuccessVerifyCode} />
      {selectedVerifyMethod === 'SMS' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <Button
            sx={{ mt: 2 }}
            size={'medium'}
            variant={'contained'}
            fullWidth
            disabled={isButtonDisabled}
            onClick={verifySmsMethod}
          >
            {t('auth:register.repeatSendCode')}
          </Button>
          {(countdown > 0 || true) && (
            <p>
              {t('auth:register.newAttemptsAt', {
                time: countdown,
                unit: t('common:seconds')
              })}
            </p>
          )}
        </Box>
      )}
      <Button sx={{ mt: 2 }} fullWidth size="large" onClick={cancelRegistration}>
        {t('common:back')}
      </Button>
    </Box>
  );
});
