import { Alert, Box, Button, Link, TextField, Typography } from '@mui/material';
import { useTranslation } from '@shared/utils/i18n';
import { observer } from 'mobx-react-lite';
import { useScreens } from '@shared/hooks/useScreens';
import { Trans } from 'react-i18next';
import { formatPhone } from '@shared/utils/helpers/formatString';
import { ConfidentialPolicy } from '@pages/auth/ConfidentialPolicy';

interface Props {
  botUrl: string;
  phone: string;
  goToVerifyCode: () => void;
  cancelRegistration: () => void;
}

export const TelegramConfirm: React.FC<Props> = observer(({ botUrl, goToVerifyCode, cancelRegistration, phone }) => {
  const { isMobile } = useScreens();
  const { t } = useTranslation();
  return (
    <Box sx={{ mb: 5, gap: '10px' }} display="flex" flexDirection="column" alignItems="center">
      <TextField sx={{ mt: 2 }} size={'small'} label={'Телефон'} value={formatPhone(phone)} disabled fullWidth />
      <ConfidentialPolicy />
      <Alert severity="info" sx={{ mb: 2 }}>
        <Trans
          t={t}
          i18nKey={'auth:register.alert'}
          values={{ botUrl }}
          components={{
            BotUrl: (
              <Link href={botUrl} target="_blank" underline="always" variant="subtitle2" onClick={goToVerifyCode} />
            )
          }}
        />
      </Alert>

      {!isMobile && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography>{t('auth:register.QRTitle')}</Typography>
          <img style={{ maxWidth: '300px', maxHeight: '300px' }} alt="qr" src="/static/images/qr.png" />
        </Box>
      )}

      <Button sx={{ mt: 1 }} fullWidth size="large" onClick={cancelRegistration}>
        {t('common:back')}
      </Button>
    </Box>
  );
});
