import { observer } from 'mobx-react-lite';
import Page from '@shared/components/Page';
import { OsiActsWidget } from '@widgets/osiActs/ui';
import { useInjection } from 'inversify-react';
import { OsiActsPageViewModel } from '../model/OsiActsPageViewModel';

const OsiActsPage: React.FC = observer(() => {
  const viewModel = useInjection(OsiActsPageViewModel);

  return (
    <Page title={viewModel.pageTitle}>
      <OsiActsWidget />
    </Page>
  );
});
export default OsiActsPage;
