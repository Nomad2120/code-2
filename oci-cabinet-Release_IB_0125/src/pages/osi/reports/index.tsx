import React from 'react';

import { Box, Container, Tab, Tabs } from '@mui/material';
import { Icon } from '@iconify/react';

import systemGroup from '@iconify/icons-eos-icons/system-group';
import Page from '@shared/components/Page';
import { PATH_OSI } from '@app/routes/paths';
import LoadingScreen from '@shared/components/LoadingScreen';
import { OSI_MENU_ITEMS } from '@shared/constants/MenuItems';

import { tokens, useTranslation } from '@shared/utils/i18n';
import { observer } from 'mobx-react-lite';
import { AccountReports } from '@pages/osi/reports/AccountReports';
import { OsiSystemReportsWidget } from '@widgets/osi/systemReports';
import { useInjection } from 'inversify-react';
import { OsiModule } from '@mobx/services/osiModule';
import { useInstructionsByTabs } from '@shared/hooks/instructions/useInstructionsByTabs';
import { MBreadcrumbs } from '@shared/components/@material-extend';
import { InstructionButton } from '@shared/components/InstructionButton/InstructionButton';
import { Header } from '@entities/osi/Header/Header';
import { links as instructionKeys } from '@shared/instructions/config';
import { Tabs as TabsKeys } from '@shared/tabs';

const OsiReportsView = observer(() => {
  const osiModule = useInjection(OsiModule);
  const isFreeVersion = osiModule?.osiInfo?.registrationType === 'FREE';
  const [currentTab, setCurrentTab] = React.useState(
    isFreeVersion ? TabsKeys.ALL_ACCOUNT_REPORTS : TabsKeys.OSI_SYSTEM_REPORTS
  );
  const { onInstructionClick } = useInstructionsByTabs({ instructionKey: instructionKeys.reports, currentTab });

  const { translateToken: tt } = useTranslation();
  if (!osiModule.osiInfo?.address) return <LoadingScreen />;

  const TABS = [
    {
      value: TabsKeys.OSI_SYSTEM_REPORTS,
      label: tt(tokens.osiReports.tabs.systemReports),
      icon: <Icon icon={systemGroup} width={20} height={20} />,
      component: <OsiSystemReportsWidget />
    },
    {
      value: TabsKeys.ALL_ACCOUNT_REPORTS,
      label: tt(tokens.osiReports.tabs.accountReports),
      icon: <Icon icon={systemGroup} width={20} height={20} />,
      component: <AccountReports />
    }
  ];

  const FreeTabs = [
    {
      value: TabsKeys.ALL_ACCOUNT_REPORTS,
      label: tt(tokens.osiReports.tabs.accountReports),
      icon: <Icon icon={systemGroup} width={20} height={20} />,
      component: <AccountReports />
    }
  ];

  const renderTabs = () => {
    if (isFreeVersion) {
      return FreeTabs.map((tab) => (
        <Tab disableRipple key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
      ));
    }

    return TABS.map((tab) => <Tab disableRipple key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />);
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: TabsKeys) => {
    setCurrentTab(newValue);
  };

  const links = [{ name: tt(tokens.common.begin), href: PATH_OSI.root }, { name: tt(OSI_MENU_ITEMS[7].titleToken) }];

  return (
    <Page title={tt(tokens.osiReports.pageTitle)}>
      <Container maxWidth="xl">
        <Header
          title={osiModule.osiInfo.address}
          Slots={{
            Breadcrumbs: <MBreadcrumbs links={links} />,
            InstructionButton: <InstructionButton onClick={onInstructionClick} />
          }}
        />
        <Tabs
          value={currentTab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={handleChangeTab}
          sx={{ mb: 5 }}
        >
          {renderTabs()}
        </Tabs>

        {TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
});

export default OsiReportsView;
