import { SetupJivo } from '@app/setup/setupJivo';
import { SnackbarUtilsConfigurator } from '@shared/utils/helpers/notistackExternal';
import GlobalStyles from '@shared/theme/globalStyles';
import { ProgressBarStyle } from '@shared/components/LoadingScreen';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import { useScrollToTop } from '@shared/hooks/useScrollToTop';
import Settings from '@shared/components/settings';
import { InstructionsWidget } from '@app/globals/Instructions/ui/InstructionsWidget';

export const RootLayout: React.FC = observer(() => {
  useScrollToTop();

  return (
    <>
      <SetupJivo />
      <SnackbarUtilsConfigurator />
      <GlobalStyles />
      <ProgressBarStyle />
      <Settings />
      <InstructionsWidget />
      <Outlet />
    </>
  );
});
