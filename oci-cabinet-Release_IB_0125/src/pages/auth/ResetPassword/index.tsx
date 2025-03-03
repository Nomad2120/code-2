import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Link, Typography } from '@mui/material';
import LogoOnlyLayout from '@app/layouts/LogoOnlyLayout';
import { PATH_AUTH } from '@app/routes/paths';
import { useTranslation, TranslatedToken, tokens } from '@shared/utils/i18n';
import { rootContainer } from '@mobx/root';
import { HistoryModule } from '@mobx/services/history';
import { observer } from 'mobx-react-lite';
import { ConfidentialPolicy } from '@pages/auth/ConfidentialPolicy';
import ChangePasswordForm from './ChangePasswordForm';
import VerifyCodeForm from './VerifyCodeForm';
import PhoneForm from './PhoneForm';
import Page from '../../../shared/components/Page';

const history = rootContainer.resolve(HistoryModule);

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

const ResetPassword = observer(() => {
  const { translateToken: tt, t } = useTranslation();
  const [phone, setPhone] = useState<string | null>(null);
  const [userId, setUserId] = useState<'' | null>('');
  const [verifyCode, setVerifyCode] = useState('');
  const [status, setStatus] = useState<any>(null);

  const checkPhoneSuccess = (phone: string, status: any) => {
    setPhone(phone);
    setStatus(status);
  };

  return (
    <RootStyle title={t('auth:resetPassword.pageTitle')}>
      <LogoOnlyLayout />

      <Container>
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
          {!phone && (
            <>
              <Typography variant="h3" paragraph>
                {t('auth:resetPassword.title')}
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 5 }}>{t('auth:resetPassword.subtitle')}</Typography>
              <PhoneForm onSuccess={checkPhoneSuccess} />
              <ConfidentialPolicy />
            </>
          )}
          {phone && !userId && (
            <>
              <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                {t('auth:resetPassword.code.main', { context: status?.isContacted ? 'telegram' : 'sms' })}
              </Typography>

              <VerifyCodeForm
                phone={phone}
                onSuccess={(userId, verifyCode) => {
                  setUserId(userId);
                  setVerifyCode(verifyCode);
                }}
              />
              <Button
                sx={{ mt: 2 }}
                fullWidth
                size="large"
                onClick={() => {
                  setPhone(null);
                  setUserId(null);
                }}
              >
                <TranslatedToken id={tokens.common.back} />
              </Button>
            </>
          )}
          {userId && verifyCode && (
            <>
              <ChangePasswordForm
                userId={userId}
                verifyCode={verifyCode}
                onSuccess={() => {
                  history.navigateTo(PATH_AUTH.login);
                }}
              />
              <Button
                sx={{ mt: 2 }}
                fullWidth
                size="large"
                onClick={() => {
                  setPhone(null);
                  setUserId(null);
                }}
              >
                <TranslatedToken id={tokens.common.back} />
              </Button>
            </>
          )}
        </Box>
      </Container>
    </RootStyle>
  );
});

export default ResetPassword;
