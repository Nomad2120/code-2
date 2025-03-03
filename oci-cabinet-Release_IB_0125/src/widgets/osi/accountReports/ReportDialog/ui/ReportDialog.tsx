import { Dialog } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { ReportDialogProvider } from '@widgets/osi/accountReports/ReportDialog/model/context';
import { AllAccountReportsViewModel } from '@widgets/osi/accountReports/allAccountReports/model/viewModel';
import { AccountReportsViewModel } from '@widgets/osi/accountReports/model/viewModel';
import { ViewMode } from '@widgets/osi/accountReports/ReportDialog/model/type';
import { ReactNode } from 'react';
import { EntryDialogView } from './views/EntryDialogView';
import { SelectAccountDialogView } from './views/SelectAccountDialogView';
import { AssignListDialogView } from './views/AssignListDialogView';
import { EditorListDialogView } from './views/EditorListDialogView';

interface Props {
  viewModel: AllAccountReportsViewModel | AccountReportsViewModel;
}

export const ReportDialog: React.FC<Props> = observer(({ viewModel }) => {
  const { reportDialog } = viewModel;
  const { viewMode } = reportDialog;

  const views: Record<ViewMode, ReactNode> = {
    [ViewMode.Entry]: <EntryDialogView />,
    [ViewMode.Select_account]: <SelectAccountDialogView />,
    [ViewMode.Assign_list]: <AssignListDialogView />,
    [ViewMode.Editing]: <EditorListDialogView />
  };

  const closeHandler = (e: any, reason: any) => {
    if (reason === 'backdropClick') return;
    viewModel.closeReportDialog();
  };

  return (
    <ReportDialogProvider viewModel={viewModel}>
      <Dialog
        open={reportDialog.isOpen}
        onClose={closeHandler}
        maxWidth={viewMode === ViewMode.Editing ? false : 'sm'}
        fullWidth
        className={'account-reports'}
      >
        {views[viewMode]}
      </Dialog>
    </ReportDialogProvider>
  );
});
