import { AppartmentReportsViewModel } from '@widgets/appartment/accountReports/model';
import { useInjection } from 'inversify-react';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { ReportsTableForAbonent } from '@widgets/appartment/accountReports/ui/table/ReportsTableForAbonent';
import { ReportsViewerForAbonent } from '@widgets/appartment/accountReports/ui/viewer/ReportsViewerForAbonent';

export const AppartmentReportsWidget: React.FC = observer(() => {
  const appartmentReportsViewModel = useInjection(AppartmentReportsViewModel);

  useEffect(() => {
    appartmentReportsViewModel.reset();
  }, []);

  return (
    <Box className={'all-accounts-reports-widget'}>
      <ReportsTableForAbonent />
      <ReportsViewerForAbonent />
    </Box>
  );
});
