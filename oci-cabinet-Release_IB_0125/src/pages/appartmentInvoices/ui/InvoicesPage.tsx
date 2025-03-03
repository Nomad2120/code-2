import Page from '@shared/components/Page';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { PATH_APPARTMENT } from '@app/routes/paths';
import HeaderBreadcrumbs from '@shared/components/HeaderBreadcrumbs';
import React from 'react';
import { Box, Container, Tab, Tabs } from '@mui/material';
import { observer } from 'mobx-react-lite';
import LoadingScreen from '@shared/components/LoadingScreen';
import { Icon } from '@iconify/react';
import invoice from '@iconify-icons/uil/invoice';
import { useInjection } from 'inversify-react';
import { AppartmentsModule } from '@mobx/services/appartments';
import { MENU_ITEMS } from '@app/layouts/appartment/SidebarConfig';
import { InvoicesWidget as AppartmentInvoicesWidget } from '../../../widgets/appartmentInvoices/ui/InvoicesWidget';

export const InvoicesPage: React.FC = observer(() => {
  const appartmentsModule = useInjection(AppartmentsModule);

  const [currentTab, setCurrentTab] = React.useState('osi-invoices');
  const { translateToken: tt } = useTranslation();

  if (!appartmentsModule.osi) return <LoadingScreen />;

  const TABS = [
    {
      value: 'osi-invoices',
      label: tt(tokens.osiInvoices.tabs.invoices),
      icon: <Icon icon={invoice} width={20} height={20} />,
      component: <AppartmentInvoicesWidget />
    }
  ];

  const handleChangeTab = (event: any, newValue: string) => {
    setCurrentTab(newValue);
  };

  return (
    <Page title={appartmentsModule.osi.name}>
      <Container maxWidth={'xl'}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <HeaderBreadcrumbs
          heading={appartmentsModule.osi.address}
          links={[
            {
              name: tt(tokens.common.begin),
              href: PATH_APPARTMENT.root
            },
            { name: tt(MENU_ITEMS[0].titleToken) }
          ]}
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
