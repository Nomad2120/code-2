import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { alpha, styled } from '@mui/material/styles';
import { Box, CardActionArea, Drawer, Stack, Tooltip } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { Logo } from '@shared/ui/logos';
import { tokens } from '@shared/utils/i18n';
import { OsiModule } from '@mobx/services/osiModule';
import { ChangeModeWidget } from '@pages/osi/root/ui/ChangeModeWidget';
import useCollapseDrawer from '../../../shared/hooks/useCollapseDrawer';
import Scrollbar from '../../../shared/components/Scrollbar';
import NavSection from '../../../shared/components/NavSection';
import { MHidden } from '../../../shared/components/@material-extend';

const DRAWER_WIDTH = 280;
const COLLAPSE_WIDTH = 102;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.complex
    })
  }
}));

interface Props {
  onToggleCollapse: () => void;
  collapseClick: boolean;
}

const IconCollapse: React.FC<Props> = ({ onToggleCollapse, collapseClick }) => (
  <Tooltip title="Mini Menu">
    <CardActionArea
      onClick={onToggleCollapse}
      sx={{
        width: 18,
        height: 18,
        display: 'flex',
        cursor: 'pointer',
        borderRadius: '50%',
        alignItems: 'center',
        color: 'text.primary',
        justifyContent: 'center',
        border: 'solid 1px currentColor',
        ...(collapseClick && {
          borderWidth: 2
        })
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: 'currentColor',
          transition: (theme) => theme.transitions.create('all'),
          ...(collapseClick && {
            width: 0,
            height: 0
          })
        }}
      />
    </CardActionArea>
  </Tooltip>
);

interface PropsSidebar {
  isOpenSidebar: boolean;
  onCloseSidebar: () => void;
}

const OsiSidebar: React.FC<PropsSidebar> = observer(({ isOpenSidebar, onCloseSidebar }) => {
  const { pathname } = useLocation();
  const osiModule = useInjection(OsiModule);
  const { menuItems } = osiModule;
  const [isChangeModeModalOpen, setIsChangeModeModalOpen] = useState(false);

  const openChangeModeModal = () => {
    setIsChangeModeModalOpen(true);
  };

  const closeChangeModeModal = () => {
    setIsChangeModeModalOpen(false);
  };

  const { isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave } =
    useCollapseDrawer();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <Stack
        spacing={3}
        sx={{
          px: 2.5,
          pt: 3,
          pb: 2,
          ...(isCollapse && {
            alignItems: 'center'
          })
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'inline-flex' }}>
            <Logo />
          </Box>

          <MHidden width="lgDown">
            {!isCollapse && <IconCollapse onToggleCollapse={onToggleCollapse} collapseClick={collapseClick} />}
          </MHidden>
        </Stack>
      </Stack>

      {osiModule.isWizardFinished && (
        <NavSection
          navConfig={[
            {
              subheaderToken: tokens.osiRoot.navBarHeader,
              items: menuItems
            }
          ]}
          isShow={!isCollapse}
          onClick={openChangeModeModal}
        />
      )}

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? COLLAPSE_WIDTH : DRAWER_WIDTH
        },
        ...(collapseClick && {
          position: 'absolute'
        })
      }}
    >
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              ...(isCollapse && {
                width: COLLAPSE_WIDTH
              }),
              ...(collapseHover && {
                borderRight: 0,
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
                boxShadow: (theme: any) => theme.customShadows.z20,
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.88)
              })
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
      <ChangeModeWidget
        isOpen={isChangeModeModalOpen}
        onClose={closeChangeModeModal}
        onChangeModeClicked={closeChangeModeModal}
      />
    </RootStyle>
  );
});
export default OsiSidebar;
