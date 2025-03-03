import { tokens, useTranslation } from '@shared/utils/i18n';
import LoadingScreen from '@shared/components/LoadingScreen';
import { Container } from '@mui/material';
import { PATH_OSI } from '@app/routes/paths';
import { OSI_MENU_ITEMS } from '@shared/constants/MenuItems';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { OsiActsWidgetViewModel } from '@widgets/osiActs/model/viewModel';
import { NotSignedActs } from '@widgets/osiActs/ui/notSigned/NotSignedActs';
import { useInstructions } from '@shared/hooks/instructions/useInstructions';
import { MBreadcrumbs } from '@shared/components/@material-extend';
import { InstructionButton } from '@shared/components/InstructionButton/InstructionButton';
import { Header } from '@entities/osi/Header/Header';
import { links as instructionKeys } from '@shared/instructions/config';
import { SignedActs } from './signed/SignedActs';

export const OsiActsWidget: React.FC = observer(() => {
  const vm = useInjection(OsiActsWidgetViewModel);
  const { translateToken: tt } = useTranslation();
  const { onInstructionClick } = useInstructions({ key: instructionKeys.acts });

  if (vm.isLoading) return <LoadingScreen />;

  const links = [{ name: tt(tokens.common.begin), href: PATH_OSI.root }, { name: tt(OSI_MENU_ITEMS[6].titleToken) }];

  return (
    <Container maxWidth="xl">
      <Header
        title={vm.osiAddress}
        Slots={{
          Breadcrumbs: <MBreadcrumbs links={links} />,
          InstructionButton: <InstructionButton onClick={onInstructionClick} />
        }}
      />
      <NotSignedActs viewModel={vm} />
      <SignedActs viewModel={vm} />
    </Container>
  );
});
