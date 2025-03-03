import { Box, Container, Tab, Tabs } from '@mui/material';
import HeaderBreadcrumbs from '@shared/components/HeaderBreadcrumbs';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { PATH_APPARTMENT } from '@app/routes/paths';
import Page from '@shared/components/Page';
import { Icon } from '@iconify/react';
import folderInfo from '@iconify-icons/uil/folder-info';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { MENU_ITEMS } from '@app/layouts/appartment/SidebarConfig';
import { AppartmentReportsWidget } from '@/widgets/appartment/accountReports';
import { AppartmentsModule } from '@/app/stores/mobx/services/appartments';

const TABS = [
  {
    value: 'account-reports',
    label: 'Отчеты перед жильцами',
    labelToken: tokens.osiReports.tabs.accountReports,
    icon: <Icon icon={folderInfo} width={20} height={20} />,
    component: <AppartmentReportsWidget />
  }
];

const AppartmentReports: React.FC = observer(() => {
  const appartmentsModule = useInjection(AppartmentsModule);
  const [currentTab, setCurrentTab] = useState(TABS[0].value);
  const { translateToken: tt } = useTranslation();

  const { osi } = appartmentsModule;

  const handleChangeTab = (event: any, newValue: string) => {
    setCurrentTab(newValue);
  };

  return (
    <Page title={osi?.name}>
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading={osi?.address}
          links={[
            { name: tt(tokens.osiRoot.breadcrumbs.begin), href: PATH_APPARTMENT.root },
            { name: tt(MENU_ITEMS[2].titleToken) }
          ]}
          action={undefined}
          sx={undefined}
        />
        <Tabs
          value={currentTab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={handleChangeTab}
        >
          {TABS.map((tab) => (
            <Tab disableRipple key={tab.value} label={tt(tab.labelToken)} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
});

export default AppartmentReports;
