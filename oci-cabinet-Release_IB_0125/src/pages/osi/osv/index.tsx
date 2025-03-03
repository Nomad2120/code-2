import React from 'react';
import { Box, Container, Tab, Tabs } from '@mui/material';
import { Icon } from '@iconify/react';
import transaction from '@iconify-icons/uil/transaction';
import balanceScale from '@iconify-icons/uil/balance-scale';
import flip from '@iconify-icons/uil/flip-h';
import chartLine from '@iconify-icons/uil/chart-line';
import { OsiOsvWidget } from '@widgets/osi/osv';
import { OsiFlatOsvWidget } from '@widgets/osi/flatOsv';
import { OsiAccrualsByAbonentWidget } from '@widgets/osi/accrualsByAbonent';
import { OsiPaymentOrdersWidget } from '@widgets/osi/paymentOrders';
import { PATH_OSI } from '@app/routes/paths';
import { OSI_MENU_ITEMS } from '@shared/constants/MenuItems';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { OsiModule } from '@mobx/services/osiModule';
import { useInstructionsByTabs } from '@shared/hooks/instructions/useInstructionsByTabs';
import { MBreadcrumbs } from '@shared/components/@material-extend';
import { InstructionButton } from '@shared/components/InstructionButton/InstructionButton';
import { Header } from '@entities/osi/Header/Header';
import { links as instructionKeys } from '@shared/instructions/config';
import { Tabs as TabsKeys } from '@shared/tabs';
import Page from '../../../shared/components/Page';
import LoadingScreen from '../../../shared/components/LoadingScreen';

const OsiOsvView = observer(() => {
  const osiModule = useInjection(OsiModule);
  const [currentTab, setCurrentTab] = React.useState(TabsKeys.OSI_OSV);
  const { translateToken: tt } = useTranslation();
  const { onInstructionClick } = useInstructionsByTabs({ instructionKey: instructionKeys.osv, currentTab });

  if (!osiModule.osiInfo?.address) return <LoadingScreen />;

  const TABS = [
    {
      value: TabsKeys.OSI_OSV,
      label: tt(tokens.osiOSV.tabs.osi),
      icon: <Icon icon={balanceScale} width={20} height={20} />,
      component: <OsiOsvWidget />
    },
    {
      value: TabsKeys.FLAT_OSV,
      label: tt(tokens.osiOSV.tabs.flats),
      icon: <Icon icon={flip} width={20} height={20} />,
      component: <OsiFlatOsvWidget />
    },
    {
      value: TabsKeys.ACCURALS_BY_ABONENT,
      label: tt(tokens.osiOSV.tabs.accruals),
      icon: <Icon icon={chartLine} width={20} height={20} />,
      component: <OsiAccrualsByAbonentWidget />
    },
    {
      value: TabsKeys.PAYMENT_ORDERS,
      label: tt(tokens.osiOSV.tabs.paymentOrders),
      icon: <Icon icon={transaction} width={20} height={20} />,
      component: <OsiPaymentOrdersWidget />
    }
  ];

  const handleChangeTab = (event: any, newValue: TabsKeys) => {
    setCurrentTab(newValue);
  };

  const links = [{ name: tt(tokens.common.begin), href: PATH_OSI.root }, { name: tt(OSI_MENU_ITEMS[4].titleToken) }];

  return (
    <Page title={tt(tokens.osiOSV.pageTitle)}>
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
});

export default OsiOsvView;
