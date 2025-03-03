import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import { alpha, styled } from '@mui/material/styles';
import { AppBar, Box, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import signoutIcon from '@iconify-icons/uil/signout';
import { useInjection } from 'inversify-react';
import { HistoryModule } from '@mobx/services/history';
import { observer } from 'mobx-react-lite';
import useCollapseDrawer from '../../../shared/hooks/useCollapseDrawer';
import { MHidden } from '../../../shared/components/@material-extend';
import { SettingsLanguage } from '../../../shared/components/settings/SettingsLanguage';
import { OsiModule } from '../../stores/mobx/services/osiModule';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const COLLAPSE_WIDTH = 102;

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

interface Props {
  onOpenSidebar: () => void;
}

export const OsiNavbar: React.FC<Props> = ({ onOpenSidebar }) => {
  const { isCollapse } = useCollapseDrawer();
  const osiModule = useInjection(OsiModule);
  const historyModule = useInjection(HistoryModule);
  if (!osiModule.osiInfo) return null;

  const osiName = osiModule.osiInfo.name;
  const { wizardStep } = osiModule.osiInfo;

  const onExitOsi = () => {
    osiModule.exitOsi();
    historyModule.goToCabinet();
  };

  return (
    <RootStyle
      sx={{
        ...(isCollapse && {
          width: { lg: `calc(100% - ${COLLAPSE_WIDTH}px)` }
        })
      }}
    >
      <ToolbarStyle>
        <MHidden width="lgUp">
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ margin: 0 }}>
            {`${osiName} ${wizardStep !== 'finish' ? ' - Ввод данных' : ''}`}
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <Box sx={{ width: '200px' }}>
            <SettingsLanguage />
          </Box>
          <IconButton onClick={onExitOsi}>
            <Icon icon={signoutIcon} />
          </IconButton>
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
};
