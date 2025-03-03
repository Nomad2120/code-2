import { useState } from 'react';
import { Box, Container, Tab, Tabs } from '@mui/material';
import { Icon } from '@iconify/react';
import flathubIcon from '@iconify-icons/simple-icons/flathub';
import peopleFill from '@iconify-icons/eva/people-fill';
import { OsiAccrualsWidget } from '@widgets/osi/accruals';
import { PATH_OSI } from '@app/routes/paths';
import { OSI_MENU_ITEMS } from '@shared/constants/MenuItems';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { OsiServiceSaldoWidget } from '@widgets/osi/osiServiceSaldo';
import { useInjection } from 'inversify-react';
import { OsiModule } from '@mobx/services/osiModule';
import { MBreadcrumbs } from '@shared/components/@material-extend';
import { InstructionButton } from '@shared/components/InstructionButton/InstructionButton';
import { Header } from '@entities/osi/Header/Header';
import { useInstructionsByTabs } from '@shared/hooks/instructions/useInstructionsByTabs';
import { links as instructionKeys } from '@shared/instructions/config';
import { Tabs as TabsKeys } from '@shared/tabs';
import Page from '../../../shared/components/Page';
import LoadingScreen from '../../../shared/components/LoadingScreen';

const OsiAccrualsView = () => {
  const [currentTab, setCurrentTab] = useState(TabsKeys.ACCRUALS);
  const osiModule = useInjection(OsiModule);
  const { translateToken: tt, t } = useTranslation();
  const { onInstructionClick } = useInstructionsByTabs({ instructionKey: instructionKeys.accruals, currentTab });
  if (!osiModule.osiInfo?.address) return <LoadingScreen />;

  const TABS = [
    {
      value: TabsKeys.ACCRUALS,
      label: t('accruals:title'),
      icon: <Icon icon={flathubIcon} width={20} height={20} style={{ margin: '0 7px 0 0' }} />,
      component: <OsiAccrualsWidget />
    },
    {
      value: TabsKeys.SALDO,
      label: t('osv:initialSaldo'),
      icon: <Icon icon={peopleFill} width={20} height={20} style={{ margin: '0 7px 0 0' }} />,
      component: <OsiServiceSaldoWidget />
    }
  ];

  const handleChangeTab = (event: React.SyntheticEvent, newValue: TabsKeys) => {
    setCurrentTab(newValue);
  };

  const links = [{ name: tt(tokens.common.begin), href: PATH_OSI.root }, { name: tt(OSI_MENU_ITEMS[3].titleToken) }];

  return (
    <Page title={tt(tokens.osiAccruals.pageTitle)}>
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

export default OsiAccrualsView;
