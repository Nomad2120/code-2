import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { AccountReportsViewModel } from '@widgets/osi/accountReports/model/viewModel';
import { useTranslation } from '@shared/utils/i18n';
import { useEffect } from 'react';
import { ReportDialog } from '@widgets/osi/accountReports/ReportDialog/ui/ReportDialog';
import { MonthlyDebtModal } from '@pages/osi/reports/MonthlyDebtModal';

export const LastMonthReportWidget: React.FC = observer(() => {
  const { fieldWithPrefix: fwp } = useTranslation();
  const viewModel = useInjection(AccountReportsViewModel);

  useEffect(() => {
    viewModel.initialize();
  }, []);

  return (
    <>
      <ReportDialog viewModel={viewModel} />
      <MonthlyDebtModal
        isOpen={viewModel.freeMode.isOpen}
        onClose={() => {
          viewModel.freeMode.isOpen = false;
        }}
        onPublishClicked={viewModel.publishReportInFreeMode}
      />
    </>
  );
});
