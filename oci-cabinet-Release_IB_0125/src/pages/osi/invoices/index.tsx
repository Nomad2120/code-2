import React from 'react';
import { Box, Container, Tab, Tabs } from '@mui/material';
import qrcode from '@iconify-icons/uil/qrcode-scan';
import invoice from '@iconify-icons/uil/invoice';
import { Icon } from '@iconify/react';
import { OsiInvoicesWidget, QrCodeInvoicesWidget } from '@widgets/osi/invoices';
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
import LoadingScreen from '../../../shared/components/LoadingScreen';
import Page from '../../../shared/components/Page';

export const InvoicesPage: React.FC = observer(() => {
  const osiModule = useInjection(OsiModule);
  const [currentTab, setCurrentTab] = React.useState(TabsKeys.OSI_INVOICES);
  const { translateToken: tt } = useTranslation();
  const { onInstructionClick } = useInstructionsByTabs({ instructionKey: instructionKeys.invoices, currentTab });

  if (!osiModule.osiId || !osiModule.osiInfo?.name || !osiModule.osiInfo?.address) return <LoadingScreen />;

  const TABS = [
    {
      value: TabsKeys.OSI_INVOICES,
      label: tt(tokens.osiInvoices.tabs.invoices),
      icon: <Icon icon={invoice} width={20} height={20} />,
      component: <OsiInvoicesWidget />
    },
    {
      value: TabsKeys.OSI_QRPAGE,
      label: tt(tokens.osiInvoices.tabs.qr),
      icon: <Icon icon={qrcode} width={20} height={20} />,
      component: <QrCodeInvoicesWidget />
    }
  ];

  const handleChangeTab = (event: any, newValue: TabsKeys) => {
    setCurrentTab(newValue);
  };

  const links = [{ name: tt(tokens.common.begin), href: PATH_OSI.root }, { name: tt(OSI_MENU_ITEMS[9].titleToken) }];

  return (
    <Page title={osiModule.osiInfo.name}>
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

export default InvoicesPage;
