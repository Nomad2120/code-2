import { observer } from 'mobx-react-lite';
import { Box, Button, TextField } from '@mui/material';
import { TimerState } from '@widgets/authRegistration/model/timerState';
import { useTranslation } from '@shared/utils/i18n';
import { formatPhone } from '@shared/utils/helpers/formatString';
import { ConfidentialPolicy } from '@pages/auth/ConfidentialPolicy';

interface Props {
  phone: string;
  goToVerifyCode: () => void;
  timerState: TimerState;
  cancelRegistration: () => void;
}

export const SMSConfirm: React.FC<Props> = observer(({ phone, goToVerifyCode, timerState, cancelRegistration }) => {
  const { t } = useTranslation();
  const onClickHandler = () => {
    goToVerifyCode();
    timerState.handleClick();
  };

  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px'
      }}
    >
      <TextField size={'small'} label={'Телефон'} value={formatPhone(phone)} disabled fullWidth />
      <ConfidentialPolicy />
      <Button
        onClick={onClickHandler}
        size={'medium'}
        variant={'contained'}
        fullWidth
        disabled={timerState.isButtonDisabled}
      >
        {t('auth:register.getSmsCode')}
      </Button>
      {timerState.countdown > 0 && (
        <p>
          {t('auth:register.newAttemptsAt', {
            time: timerState.countdown,
            unit: t('common:seconds')
          })}
        </p>
      )}
      <Button sx={{ mt: 0 }} fullWidth size="large" onClick={cancelRegistration}>
        {t('common:back')}
      </Button>
    </Box>
  );
});
