import { observer } from 'mobx-react-lite';
import { useTranslation } from '@shared/utils/i18n';
import { AlreadyRegistered, Header, RegistrationWidget } from '@widgets/authRegistration/ui';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

export const RegistrationPage: React.FC = observer(() => {
  const { translateToken: tt } = useTranslation();

  return (
    <>
      <Header>
        <AlreadyRegistered />
      </Header>
      <Container>
        <ContentStyle>
          <RegistrationWidget />
        </ContentStyle>
      </Container>
    </>
  );
});
