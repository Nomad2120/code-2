import { Box, Link, Typography } from '@mui/material';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { observer } from 'mobx-react-lite';
import { RegistrationWidgetViewModel } from '@widgets/authRegistration/model/viewModel';
import { PhoneField } from '@widgets/authRegistration/ui/PhoneField';
import { ConfidentialPolicy } from '@pages/auth/ConfidentialPolicy';

interface Props {
  viewModel: RegistrationWidgetViewModel;
}

export const RegistrationPhone: React.FC<Props> = observer(({ viewModel }) => {
  const { translateToken: tt, t } = useTranslation();

  return (
    <Box>
      <PhoneField onSubmit={viewModel.checkContactPhone} initialPhone={viewModel.phone} />
      <ConfidentialPolicy />
    </Box>
  );
});
