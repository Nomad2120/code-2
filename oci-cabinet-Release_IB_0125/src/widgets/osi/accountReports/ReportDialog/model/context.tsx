import { createContext, ReactNode, useContext } from 'react';
import { AccountReportsViewModel } from '@widgets/osi/accountReports/model/viewModel';
import { AllAccountReportsViewModel } from '@widgets/osi/accountReports/allAccountReports/model/viewModel';

type ContextType = AccountReportsViewModel | AllAccountReportsViewModel;

const ReportDialogContext = createContext<ContextType | null>(null);

interface Props {
  viewModel: ContextType;
  children: ReactNode;
}

const ReportDialogProvider: React.FC<Props> = ({ viewModel, children }) => (
  <ReportDialogContext.Provider value={viewModel}>{children}</ReportDialogContext.Provider>
);

const useReportDialogContext = () => {
  const context = useContext(ReportDialogContext);

  if (context === undefined) {
    throw new Error('useReportDialogContext was used outside of its context');
  }

  return context;
};

export { ReportDialogProvider, useReportDialogContext };
