import { AccountReportsModule } from '@mobx/services/osi/accountReports';
import { useInjection } from 'inversify-react';
import { AllAccountReportsWidget } from '@widgets/osi/accountReports/allAccountReports/ui';
import { observer } from 'mobx-react-lite';

export const AccountReports: React.FC = observer(() => {
  const accountReportsModule = useInjection(AccountReportsModule);

  return <AllAccountReportsWidget />;
});
