import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';

interface Props {
  children: React.ReactNode;
}

export const WizardButtonsWrapper: React.FC<Props> = observer(({ children }) => (
  <Box sx={{ marginBlockStart: '10px', display: 'flex', columnGap: '10px' }}>{children}</Box>
));
