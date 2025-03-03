import { Container } from '@mui/material';
import { StepsWidget } from '@widgets/wizard';
import Page from '@shared/components/Page';
import { observer } from 'mobx-react-lite';

const WizardPage: React.FC = observer(() => (
  <Page title="Ввод данных">
    <Container maxWidth="xl">
      <StepsWidget />
    </Container>
  </Page>
));

export default WizardPage;
