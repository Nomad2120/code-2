import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { alpha, styled } from '@mui/material/styles';
import { Avatar, Box, Drawer, Link, Stack, Typography } from '@mui/material';
import { PATH_AUTH, PATH_CABINET } from '@app/routes/paths';
import { Logo } from '@shared/ui/logos';
import { IconCollapse } from '@shared/components/IconCollapse';
import { useInjection } from 'inversify-react';
import sidebarConfig from '@entities/cabinet/sidebar/constants';
import { CabinetSidebarViewModel } from '@entities/cabinet/sidebar/model';
import useCollapseDrawer from '@shared/hooks/useCollapseDrawer';
import Scrollbar from '@shared/components/Scrollbar';
import NavSection from '@shared/components/NavSection';
import { MHidden } from '@shared/components/@material-extend';
import { useTranslation } from '@shared/utils/i18n';
import { InstructionButton } from '@shared/components/InstructionButton/InstructionButton';
import { InstructionDialog } from '@entities/cabinet/sidebar/ui/InstructionDialog';

const DRAWER_WIDTH = 280;
const COLLAPSE_WIDTH = 102;

interface Props {
  isOpenSidebar: boolean;
  onCloseSidebar: () => void;
}

export default function CabinetSidebar({ isOpenSidebar, onCloseSidebar }: Props) {
  const { pathname } = useLocation();
  const { translateToken: tt, fieldWithPrefix: fwp } = useTranslation();
  const vm = useInjection(CabinetSidebarViewModel);
  const [isInstructionDialogOpen, setIsInstructionDialogOpen] = useState(false);
  // const role = useSelector(roleSelector);
  const rolesCount = vm.roles?.length;

  const { isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave } =
    useCollapseDrawer();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const openInstructions = () => {
    setIsInstructionDialogOpen(true);
  };

  const closeInstructions = () => {
    setIsInstructionDialogOpen(false);
  };

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%',
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
          <Box component={RouterLink} to={PATH_CABINET.root} sx={{ display: 'inline-flex' }}>
            <Logo />
          </Box>

          <MHidden width="lgDown">
            {!isCollapse && <IconCollapse onToggleCollapse={onToggleCollapse} collapseClick={collapseClick} />}
          </MHidden>
        </Stack>
        {vm.currentRole && (
          <Box>
            {isCollapse ? (
              <Avatar sx={{ mx: 'auto', mb: 2 }} alt="My Avatar" src="/static/mock-images/avatars/avatar_default.jpg" />
            ) : (
              <Link
                underline="none"
                component={RouterLink}
                to={vm.roles && vm.roles?.length > 1 ? PATH_AUTH.selectRole : PATH_CABINET.user}
              >
                <Box
                  sx={(theme: any) => ({
                    display: 'flex',
                    alignItems: 'center',
                    padding: theme.spacing(2, 2.5),
                    borderRadius: theme.shape.borderRadiusSm,
                    backgroundColor: theme.palette.grey[500_12]
                  })}
                >
                  <Avatar alt="My Avatar" src="/static/mock-images/avatars/avatar_default.jpg" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      {fwp(vm.currentRole, 'name')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {vm.userInfo?.fio}
                    </Typography>
                  </Box>
                </Box>
              </Link>
            )}
          </Box>
        )}
      </Stack>

      <NavSection navConfig={sidebarConfig} isShow={!isCollapse} />
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '100px',
          '& > div': {
            width: '80%',
            height: '100px',
            margin: '0 auto'
          },
          '& > #instructions': {
            width: '90%',
            height: '140px'
          }
        }}
      >
        <InstructionButton id={'instructions'} onClick={openInstructions} />
        <InstructionDialog isOpen={isInstructionDialogOpen} onClose={closeInstructions} />
      </Box>
    </Scrollbar>
  );

  return (
    <Box
      sx={(theme: any) => ({
        [theme.breakpoints.up('lg')]: {
          flexShrink: 0,
          transition: theme.transitions.create('width', {
            duration: theme.transitions.duration.complex
          })
        },
        width: {
          lg: isCollapse ? COLLAPSE_WIDTH : DRAWER_WIDTH
        },
        ...(collapseClick && {
          position: 'absolute'
        })
      })}
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
    </Box>
  );
}
