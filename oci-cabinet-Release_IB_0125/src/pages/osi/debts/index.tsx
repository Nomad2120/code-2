import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { tokens, useTranslation } from '@shared/utils/i18n';
import LoadingScreen from '@shared/components/LoadingScreen';
import { Icon } from '@iconify/react';
import outlineHistory from '@iconify/icons-ic/outline-history';
import fileDocument from '@iconify/icons-mdi/file-document';
import Page from '@shared/components/Page';
import { OSI_MENU_ITEMS } from '@shared/constants/MenuItems';
import { Box, Container, Tab, Tabs } from '@mui/material';
import { PATH_OSI } from '@app/routes/paths';
import { OsiDebtsWidget } from '@widgets/osi/debts';
import { OsiSampleDocumentsWidget } from '@widgets/osi/sampleDocuments';
import { useInjection } from 'inversify-react';
import { OsiModule } from '@mobx/services/osiModule';
import { useInstructionsByTabs } from '@shared/hooks/instructions/useInstructionsByTabs';
import { MBreadcrumbs } from '@shared/components/@material-extend';
import { InstructionButton } from '@shared/components/InstructionButton/InstructionButton';
import { Header } from '@entities/osi/Header/Header';
import { links as instructionKeys } from '@shared/instructions/config';
import { Tabs as TabsKeys } from '@shared/tabs';

const DebtsPage: React.FC = observer(() => {
  const [currentTab, setCurrentTab] = useState(TabsKeys.DEBT_PERIODS);
  const osiModule = useInjection(OsiModule);
  const { onInstructionClick } = useInstructionsByTabs({ instructionKey: instructionKeys.debts, currentTab });
  const { translateToken: tt } = useTranslation();

  if (!osiModule.osiInfo?.address) return <LoadingScreen />;

  const TABS = [
    {
      value: TabsKeys.DEBT_PERIODS,
      label: tt(tokens.osiDebts.tabs.debts),
      icon: <Icon icon={outlineHistory} width={20} height={20} style={{ margin: '0 7px 0 0' }} />,
      component: <OsiDebtsWidget />
    },
    {
      value: TabsKeys.SAMPLE_DOCUMENTS,
      label: tt(tokens.osiDebts.tabs.docs),
      icon: <Icon icon={fileDocument} width={20} height={20} style={{ margin: '0 7px 0 0' }} />,
      component: <OsiSampleDocumentsWidget />
    }
  ];

  const handleChangeTab = (event: any, newValue: TabsKeys) => {
    setCurrentTab(newValue);
  };

  const links = [{ name: tt(tokens.common.begin), href: PATH_OSI.root }, { name: tt(OSI_MENU_ITEMS[8].titleToken) }];

  return (
    <Page title={tt(OSI_MENU_ITEMS[8].titleToken)}>
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

export default DebtsPage;
