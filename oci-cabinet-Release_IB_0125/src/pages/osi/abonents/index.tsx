import { Container } from '@mui/material';
import { PATH_OSI } from '@app/routes/paths';
import { OSI_MENU_ITEMS } from '@shared/constants/MenuItems';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { useInjection } from 'inversify-react';
import { OsiModule } from '@mobx/services/osiModule';
import { observer } from 'mobx-react-lite';
import { OsiAbonentsWidget } from '@widgets/osi/abonents';
import { MBreadcrumbs } from '@shared/components/@material-extend';
import { InstructionButton } from '@shared/components/InstructionButton/InstructionButton';
import { Header } from '@entities/osi/Header/Header';
import { useInstructions } from '@shared/hooks/instructions/useInstructions';
import { links as instructionKeys } from '@shared/instructions/config';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import Page from '../../../shared/components/Page';

export const OsiAbonentsPage: React.FC = observer(() => {
  const osiModule = useInjection(OsiModule);
  const { translateToken: tt } = useTranslation();
  const { onInstructionClick } = useInstructions({ key: instructionKeys.abonents });
  if (!osiModule.osiInfo?.address || !osiModule.osiInfo?.name) return <LoadingScreen />;

  const links = [{ name: tt(tokens.common.begin), href: PATH_OSI.root }, { name: tt(OSI_MENU_ITEMS[2].titleToken) }];

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
        <OsiAbonentsWidget />
      </Container>
    </Page>
  );
});

export default OsiAbonentsPage;
