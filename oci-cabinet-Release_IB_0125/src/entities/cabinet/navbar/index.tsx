import useCollapseDrawer from '@shared/hooks/useCollapseDrawer';
import { AppBar, Box, IconButton, Stack, Toolbar } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import { SettingsLanguage } from '@shared/components/settings/SettingsLanguage';
import { AccountPopover } from '@entities/cabinet/account/ui';
import { MHidden } from '@shared/components/@material-extend';

const DRAWER_WIDTH = 280;
const COLLAPSE_WIDTH = 102;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

interface Props {
  onOpenSidebar: () => void;
}

export default function CabinetNavbar({ onOpenSidebar }: Props) {
  const { isCollapse } = useCollapseDrawer() as any;

  return (
    <AppBar
      sx={(theme: any) => ({
        ...(isCollapse && {
          width: { lg: `calc(100% - ${COLLAPSE_WIDTH}px)` }
        }),
        zIndex: 1000,
        boxShadow: 'none',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
        backgroundColor: alpha(theme.palette.background.default, 0.72),
        [theme.breakpoints.up('lg')]: {
          width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
        }
      })}
    >
      <Toolbar
        sx={(theme: any) => ({
          minHeight: `${APPBAR_MOBILE}px`,
          [theme.breakpoints.up('lg')]: {
            minHeight: `${APPBAR_DESKTOP}px`,
            padding: theme.spacing(0, 5)
          }
        })}
      >
        <MHidden width="lgUp">
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <Box sx={{ width: '200px' }}>
            <SettingsLanguage />
          </Box>
          <AccountPopover />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
