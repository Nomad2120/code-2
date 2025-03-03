import { useInjection } from 'inversify-react';
import { AllAccountReportsViewModel } from '@widgets/osi/accountReports/allAccountReports/model/viewModel';
import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { ReportDialog } from '@widgets/osi/accountReports/ReportDialog/ui/ReportDialog';
import LoadingScreen from '@shared/components/LoadingScreen';
import { ReportsTable } from './ReportsTable';

export const AllAccountReportsWidget: React.FC = observer(() => {
  const viewModel = useInjection(AllAccountReportsViewModel);

  useEffect(() => {
    viewModel.initialize();
  }, []);

  if (viewModel.isLoading) return <LoadingScreen />;

  return (
    <Box className={'all-accounts-reports-widget'}>
      <ReportsTable />
      <ReportDialog viewModel={viewModel} />
    </Box>
  );
});
