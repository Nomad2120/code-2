import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import { EditForm } from './edit/EditForm';
import { CreateForm } from './create/CreateForm';
import { useRegistrationWizardContext } from '../../store/RegistrationWizardProvider';

export const RegistrationInfo: React.FC = observer(() => {
  const wizard = useRegistrationWizardContext();

  if (!wizard?.registration)
    return (
      <Box>
        <CreateForm />
      </Box>
    );

  return (
    <Box>
      <EditForm />
    </Box>
  );
});
