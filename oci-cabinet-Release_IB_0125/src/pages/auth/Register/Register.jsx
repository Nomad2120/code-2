import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Alert, Box, Button, Container, Link, Typography } from '@mui/material';
import { ConfidentialPolicy } from '@pages/auth/ConfidentialPolicy';
import { PATH_AUTH, PATH_CABINET } from '../../../app/routes/paths';
import AuthLayout from '../../../app/layouts/AuthLayout';
import Page from '../../../shared/components/Page';
import useIsMountedRef from '../../../shared/hooks/useIsMountedRef';

import PhoneForm from './PhoneForm';
import VerifyCodeForm from './VerifyCodeForm';
import ChangePasswordForm from './ChangePasswordForm';
import { tokens } from '../../../shared/utils/i18n/messages';
import { TranslatedToken } from '../../../shared/utils/i18n/utils/components';
import { useTranslation } from '../../../shared/utils/i18n/utils/hooks/useTranslation';
import { MHidden } from '../../../shared/components/@material-extend';
import { rootContainer } from '../../../app/stores/mobx/root';
import { HistoryModule } from '../../../app/stores/mobx/services/history';

const history = rootContainer.resolve(HistoryModule);

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------
const url = `${process.env.REACT_APP_API_URL.replace('http', 'ws')}/ws`;

export default function Register() {
  const { translateToken: tt, t } = useTranslation();
  const [phone, setPhone] = useState(null);
  const [isBotClicked, setBotClicked] = useState(false);
  const [botUrl, setBotUrl] = useState('');
  const [userId, setUserId] = useState('');
  const [socket] = useState(new WebSocket(url));
  const isMountedRef = useIsMountedRef();

  const sendMessage = useCallback(
    (data) => {
      if (socket.readyState !== WebSocket.CLOSED) {
        socket.send(JSON.stringify(data));
      }
    },
    [socket]
  );

  useEffect(() => {
    socket.onmessage = (msg) => {
      if (isMountedRef && msg.data === 'success') {
        setBotClicked(true);
      }
    };

    return function cleanup() {
      sendMessage({
        name: 'stop_wait_end_registration'
      });
    };
  }, [socket, isMountedRef, sendMessage, setBotClicked]);

  return (
    <RootStyle title="Регистрация">
      <AuthLayout>
        {`${tt(tokens.register.alreadyRegistered)}?`}&nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to={PATH_AUTH.login}>
          <TranslatedToken id={tokens.common.login} />
        </Link>
      </AuthLayout>

      <Container>
        <ContentStyle>
          <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                <TranslatedToken id={tokens.register.title} />
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                <TranslatedToken id={tokens.register.subtitle} />
              </Typography>
            </Box>
          </Box>
          {!phone && (
            <>
              <PhoneForm
                onSuccess={(phone, botUrl) => {
                  setPhone(phone);
                  if (!botUrl) setBotClicked(true);
                  else setBotUrl(botUrl);
                  sendMessage({
                    name: 'wait_end_registration',
                    data: {
                      phone
                    }
                  });
                }}
              />
              <ConfidentialPolicy />
            </>
          )}
          {phone && !isBotClicked && (
            <Box sx={{ mb: 5 }} display="flex" flexDirection="column" alignItems="center">
              <Alert severity="info" sx={{ mb: 2 }}>
                `${tt(tokens.register.continueRegister)}`&nbsp;
                <Link
                  href={botUrl}
                  target="_blank"
                  underline="always"
                  variant="subtitle2"
                  onClick={() => {
                    if (!isBotClicked) setBotClicked(true);
                  }}
                >
                  {botUrl}
                </Link>
              </Alert>
              <img alt="qr" src="/static/images/qr.png" />
            </Box>
          )}
          {phone && isBotClicked && !userId && (
            <>
              <VerifyCodeForm phone={phone} onSuccess={setUserId} />
              <Button
                sx={{ mt: 2 }}
                fullWidth
                size="large"
                onClick={() => {
                  setPhone(null);
                  setUserId(null);
                  setBotClicked(false);
                }}
              >
                <TranslatedToken id={tokens.common.back} />
              </Button>
            </>
          )}
          {userId && (
            <>
              <ChangePasswordForm
                userId={userId}
                onSuccess={() => {
                  history.navigateTo(PATH_CABINET.root);
                }}
              />
              <Button
                sx={{ mt: 2 }}
                fullWidth
                size="large"
                onClick={() => {
                  setPhone(null);
                  setUserId(null);
                  setBotClicked(false);
                }}
              >
                <TranslatedToken id={tokens.common.back} />
              </Button>
            </>
          )}

          <MHidden width="smUp">
            <Typography variant="subtitle2" sx={{ mt: 3, textAlign: 'center' }}>
              {`${tt(tokens.register.alreadyRegistered)}?`}&nbsp;
              <Link to={PATH_AUTH.login} component={RouterLink}>
                <TranslatedToken id={tokens.common.login} />
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
