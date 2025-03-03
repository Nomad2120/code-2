import { observer } from 'mobx-react-lite';
import { Container } from '@mui/material';
import { useContainer } from 'inversify-react';
import { OsiModule } from '@mobx/services/osiModule';
import { OsiInfoWidget } from '@widgets/osi/info';
import LoadingScreen from '@shared/components/LoadingScreen';
import Page from '@shared/components/Page';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { PATH_OSI } from '@app/routes/paths';
import { OSI_MENU_ITEMS } from '@shared/constants/MenuItems';
import { Icon } from '@iconify/react';
import folderInfo from '@iconify-icons/uil/folder-info';
import { Tabs } from '@shared/components/Tabs';
import { useState } from 'react';
import roundReceipt from '@iconify-icons/ic/round-receipt';
import baselineHomeRepairService from '@iconify-icons/ic/baseline-home-repair-service';
import { OsiAccountsWidget } from '@widgets/osi/accounts';
import { OsiServiceCompaniesWidget } from '@widgets/osi/osiServiceCompanies';
import { Header } from '@entities/osi/Header/Header';
import { MBreadcrumbs } from '@shared/components/@material-extend';
import { InstructionButton } from '@shared/components/InstructionButton/InstructionButton';
import { links as instructionKeys } from '@shared/instructions/config';
import { Tabs as TabsKeys } from '@shared/tabs';
import { useInstructionsByTabs } from '@shared/hooks/instructions/useInstructionsByTabs';

export const OsiInfoPage: React.FC = observer(() => {
  const osiModule = useContainer().getNamed<OsiModule>(OsiModule, 'v2');
  const [currentTab, setCurrentTab] = useState(TabsKeys.OSI_INFO);
  const { translateToken: tt } = useTranslation();

  const { onInstructionClick } = useInstructionsByTabs({ instructionKey: instructionKeys.info, currentTab });

  if (!osiModule.osiInfo?.name) return <LoadingScreen />;

  const tabs = [
    {
      value: TabsKeys.OSI_INFO,
      label: 'Основные данные',
      labelToken: tokens.osiInfo.mainInfo.tabTitle,
      icon: <Icon icon={folderInfo} width={20} height={20} />,
      component: <OsiInfoWidget />
    },
    {
      value: TabsKeys.ACCOUNTS,
      label: 'Счета',
      labelToken: tokens.osiInfo.bills.tabTitle,
      icon: <Icon icon={roundReceipt} width={20} height={20} />,
      component: <OsiAccountsWidget />
    },
    {
      value: TabsKeys.SERVICE_COMPANIES,
      label: 'Сервисные компании',
      labelToken: tokens.osiInfo.companies.tabTitle,
      icon: <Icon icon={baselineHomeRepairService} width={20} height={20} />,
      component: <OsiServiceCompaniesWidget />
    }
  ];

  const links = [
    { name: tt(tokens.osiRoot.breadcrumbs.begin), href: PATH_OSI.root },
    { name: tt(OSI_MENU_ITEMS[0].titleToken) }
  ];

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
        <Tabs tabs={tabs} currentTab={currentTab} onTabChange={setCurrentTab} />
      </Container>
    </Page>
  );
});
