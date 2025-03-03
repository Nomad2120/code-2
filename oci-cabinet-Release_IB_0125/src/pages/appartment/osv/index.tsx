import { useState } from 'react';

import { Box, Container, Tab, Tabs } from '@mui/material';
import { Icon } from '@iconify/react';
import balanceScale from '@iconify-icons/uil/balance-scale';
import flip from '@iconify-icons/uil/flip-h';
import chartLine from '@iconify-icons/uil/chart-line';

import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import HeaderBreadcrumbs from '@shared/components/HeaderBreadcrumbs';
import { PATH_APPARTMENT } from '@app/routes/paths';
import { AppartmentsModule } from '@mobx/services/appartments';
import { ProfileModule } from '@mobx/services/profile';
import { useTranslation } from '@shared/utils/i18n';
import { MENU_ITEMS } from '@app/layouts/appartment/SidebarConfig';
import { OsiSaldo } from './OsiSaldo';
import { FlatSaldo } from './FlatSaldo';
import { AccrualsByAbonent } from './AccrualsByAbonent';

import Page from '../../../shared/components/Page';
import LoadingScreen from '../../../shared/components/LoadingScreen';

const OsvPage = observer(() => {
  const [currentTab, setCurrentTab] = useState('osi-saldo');
  const { translateToken: tt } = useTranslation();

  const appartmentsModule = useInjection(AppartmentsModule);
  const profileModule = useInjection(ProfileModule);

  if (!appartmentsModule.osi || !profileModule.userData?.id) return <LoadingScreen />;

  const { osi } = appartmentsModule;
  const { userData: user } = profileModule;

  const TABS = [
    {
      value: 'osi-saldo',
      label: 'ОСИ',
      icon: <Icon icon={balanceScale} width={20} height={20} />,
      component: <OsiSaldo osi={osi} userId={user?.id} />
    },
    {
      value: 'flat-saldo',
      label: 'Помещения',
      icon: <Icon icon={flip} width={20} height={20} />,
      component: <FlatSaldo osi={osi} userId={user?.id} />
    },
    {
      value: 'accurals-by-abonent',
      label: 'Начисления',
      icon: <Icon icon={chartLine} width={20} height={20} />,
      component: <AccrualsByAbonent osi={osi} userId={user?.id} />
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
          links={[{ name: 'Начало', href: PATH_APPARTMENT.root }, { name: tt(MENU_ITEMS[1].titleToken) }]}
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

export default OsvPage;
