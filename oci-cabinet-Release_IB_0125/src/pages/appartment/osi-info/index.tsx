import { useState } from 'react';

import { Icon } from '@iconify/react';
import roundReceipt from '@iconify-icons/ic/round-receipt';
import folderInfo from '@iconify-icons/uil/folder-info';
import baselineHomeRepairService from '@iconify-icons/ic/baseline-home-repair-service';

import { Box, Container, Tab, Tabs } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import HeaderBreadcrumbs from '@shared/components/HeaderBreadcrumbs';
import { PATH_APPARTMENT } from '@app/routes/paths';
import { AppartmentsModule } from '@mobx/services/appartments';
import { useTranslation } from '@shared/utils/i18n';
import { MENU_ITEMS } from '@app/layouts/appartment/SidebarConfig';
import { ServiceCompaniesList } from './ServiceCompaniesList';
import { OsiInfo } from './OsiInfo';
import { Accounts } from './Accounts';

import Page from '../../../shared/components/Page';
import LoadingScreen from '../../../shared/components/LoadingScreen';

const OsiInfoPage: React.FC = observer(() => {
  const [currentTab, setCurrentTab] = useState('osi-info');
  const { translateToken: tt } = useTranslation();

  const appartmentsModule = useInjection(AppartmentsModule);
  if (!appartmentsModule.osi) return <LoadingScreen />;
  const { osi, accounts, serviceCompanies, docs } = appartmentsModule;

  const TABS = [
    {
      value: 'osi-info',
      label: 'Основные данные',
      icon: <Icon icon={folderInfo} width={20} height={20} />,
      component: <OsiInfo osi={osi} docs={docs} />
    },
    {
      value: 'accounts',
      label: 'Счета',
      icon: <Icon icon={roundReceipt} width={20} height={20} />,
      component: <Accounts accounts={accounts} />
    },
    {
      value: 'service-companies',
      label: 'Сервисные компании',
      icon: <Icon icon={baselineHomeRepairService} width={20} height={20} />,
      component: <ServiceCompaniesList companies={serviceCompanies} />
    }
  ];

  const handleChangeTab = (event: any, newValue: string) => {
    setCurrentTab(newValue);
  };

  return (
    <Page title={osi.name}>
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading={osi.address}
          links={[{ name: 'Начало', href: PATH_APPARTMENT.root }, { name: tt(MENU_ITEMS[0].titleToken) }]}
        />
        <Tabs
          value={currentTab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={handleChangeTab}
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

export default OsiInfoPage;
