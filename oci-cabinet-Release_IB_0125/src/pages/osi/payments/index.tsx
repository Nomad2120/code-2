import React from 'react';
import { Box, Container, Tab, Tabs } from '@mui/material';
import { Icon } from '@iconify/react';
import transaction from '@iconify-icons/uil/transaction';
import patchFixes from '@iconify/icons-eos-icons/patch-fixes';
import { OsiPaymentsWidget } from '@widgets/osi/payments';
import { OsiCorrectionWidget } from '@widgets/osi/correction';
import { PATH_OSI } from '@app/routes/paths';
import { OSI_MENU_ITEMS } from '@shared/constants/MenuItems';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { useInjection } from 'inversify-react';
import { OsiModule } from '@mobx/services/osiModule';
import { useInstructionsByTabs } from '@shared/hooks/instructions/useInstructionsByTabs';
import { MBreadcrumbs } from '@shared/components/@material-extend';
import { InstructionButton } from '@shared/components/InstructionButton/InstructionButton';
import { Header } from '@entities/osi/Header/Header';
import { links as instructionKeys } from '@shared/instructions/config';
import { Tabs as TabsKeys } from '@shared/tabs';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import Page from '../../../shared/components/Page';

const OsiPaymentsPage = () => {
  const osiModule = useInjection(OsiModule);
  const [currentTab, setCurrentTab] = React.useState(TabsKeys.OSI_PAYMENTS);
  const { translateToken: tt } = useTranslation();
  const { onInstructionClick } = useInstructionsByTabs({ instructionKey: instructionKeys.payments, currentTab });

  if (!osiModule.osiInfo?.address) return <LoadingScreen />;

  const TABS = [
    {
      value: TabsKeys.OSI_PAYMENTS,
      label: tt(tokens.osiPayments.tabs.payments),
      icon: <Icon icon={transaction} width={20} height={20} />,
      component: <OsiPaymentsWidget />
    },
    {
      value: TabsKeys.OSI_FIXES,
      label: tt(tokens.osiPayments.tabs.corrections),
      icon: <Icon icon={patchFixes} width={20} height={20} />,
      component: <OsiCorrectionWidget />
    }
  ];

  const handleChangeTab = (event: any, newValue: TabsKeys) => {
    setCurrentTab(newValue);
  };

  const links = [{ name: tt(tokens.common.begin), href: PATH_OSI.root }, { name: tt(OSI_MENU_ITEMS[5].titleToken) }];

  return (
    <Page title={tt(tokens.osiPayments.pageTitle)}>
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
          {TABS.map((tab) => (
            <Tab disableRipple key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
};

export default OsiPaymentsPage;
