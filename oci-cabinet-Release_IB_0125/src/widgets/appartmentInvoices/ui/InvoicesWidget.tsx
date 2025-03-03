import { Box, Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { tokens, TranslatedToken } from '@shared/utils/i18n';
import LoadingScreen from '@shared/components/LoadingScreen';
import { useInjection } from 'inversify-react';
import { InvoicesWidgetViewModel } from '../model/viewModel';

export const InvoicesWidget: React.FC = observer(() => {
  const viewModel = useInjection(InvoicesWidgetViewModel);

  if (viewModel.isLoading) return <LoadingScreen />;

  return (
    <Box>
      <Button variant="outlined" color="primary" onClick={viewModel.createInvoices} sx={{ mb: 2, mr: 1 }} size="small">
        <TranslatedToken id={tokens.osiInvoices.createInvoices} />
      </Button>
    </Box>
  );
});
