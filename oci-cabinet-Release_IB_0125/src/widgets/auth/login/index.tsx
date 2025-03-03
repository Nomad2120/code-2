import { useState } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import { useInjection } from 'inversify-react';
import Page from '@shared/components/Page';
import { LoginViewModel } from '@widgets/auth/login/model/LoginViewModel';
import { formatPhone } from '@shared/utils/helpers/formatString';
import LogoOnlyLayout from '@app/layouts/LogoOnlyLayout';
import { useInstructions } from '@shared/hooks/instructions/useInstructions';
import { links as instructionKeys } from '@shared/instructions/config';
import { InstructionButton } from '@shared/components/InstructionButton/InstructionButton';
import { observer } from 'mobx-react-lite';
import { styled } from '@mui/material/styles';
import VerifyCodeForm from './ui/VerifyCodeForm';
import { PhoneForm } from './ui/PhoneForm';

const InstructionButtonStyled = styled(InstructionButton)(({ theme }) => ({
  position: 'relative',
  maxWidth: '180px',
  maxHeight: '90px',
  minWidth: '120px',
  minHeight: '70px',
  width: 'unset',
  height: 'unset'
}));

export const Login: React.FC = observer(() => {
  const { onInstructionClick } = useInstructions({ key: instructionKeys.auth });
  const viewModel = useInjection(LoginViewModel);
  const { translateToken: tt } = useTranslation();
  const [phone, setPhone] = useState<string | null>(null);

  const initialPhone = formatPhone(window.history.state?.usr?.phone);

  const onPhoneFormSuccessHandler = (phone: string): void => {
    setPhone(phone);
  };
  return (
    <Page
      sx={{
        display: { md: 'flex' }
      }}
      title="Вход в Кабинет ОСИ"
    >
      <LogoOnlyLayout />
      <Container maxWidth="sm">
        <Box
          sx={(theme) => ({
            maxWidth: 480,
            margin: 'auto',
            display: 'flex',
            minHeight: '100dvh',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: theme.spacing(12, 0),
            paddingBottom: 2
          })}
        >
          <Stack direction="row" alignItems="center" sx={{ mb: 5, gap: '5px' }}>
            <Box sx={{ flexGrow: 1, position: 'relative' }}>
              <Typography variant="h4" gutterBottom>
                <TranslatedToken id={tokens.login.title} />
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {!phone ? `${tt(tokens.login.phonePlaceholder)}` : `${tt(tokens.login.sixDigitsPassword)}`}
              </Typography>
            </Box>
            <Box>
              <InstructionButtonStyled onClick={onInstructionClick} />
            </Box>
          </Stack>

          {!phone && <PhoneForm onSuccess={onPhoneFormSuccessHandler} initialPhone={initialPhone} />}
          {phone && (
            <>
              <VerifyCodeForm
                onSuccess={(code) => {
                  viewModel.authUser(phone, code);
                }}
              />
              <Button
                sx={{ mt: 2 }}
                fullWidth
                size="large"
                onClick={() => {
                  setPhone(null);
                }}
              >
                <Typography>
                  <TranslatedToken id={tokens.common.back} />
                </Typography>
              </Button>
            </>
          )}
        </Box>
      </Container>
    </Page>
  );
});
