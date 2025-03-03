import ChangePasswordForm from '@pages/auth/Register/ChangePasswordForm';
import { Box, Button } from '@mui/material';
import { tokens, TranslatedToken } from '@shared/utils/i18n';
import { observer } from 'mobx-react-lite';
import { RegistrationWidgetViewModel } from '@widgets/authRegistration/model/viewModel';
import LoadingWrapper from '@shared/components/LoadingWrapper';

interface Props {
  viewModel: RegistrationWidgetViewModel;
}

export const ChangePassword: React.FC<Props> = observer(({ viewModel }) => {
  const { userId, onPasswordChanged, cancelRegistration } = viewModel;

  if (!userId) return <LoadingWrapper />;

  return (
    <Box>
      <ChangePasswordForm userId={userId} onSuccess={onPasswordChanged} />
      <Button sx={{ mt: 2 }} fullWidth size="large" onClick={cancelRegistration}>
        <TranslatedToken id={tokens.common.back} />
      </Button>
    </Box>
  );
});
