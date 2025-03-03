import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { useInjection } from 'inversify-react';
import { ProfileModule } from '@mobx/services/profile';
import Navbar from '@entities/cabinet/navbar';
import Sidebar from '@entities/cabinet/sidebar/ui';
import { observer } from 'mobx-react-lite';
import useCollapseDrawer from '../../../shared/hooks/useCollapseDrawer';

const DashboardLayout = observer(() => {
  const { collapseClick } = useCollapseDrawer();
  const [open, setOpen] = useState(false);
  const profileModule = useInjection(ProfileModule);
  const user = profileModule.userData.info;
  const isEmptyUser = !user || !user.fio;

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100%',
        overflow: 'hidden'
      }}
    >
      {!isEmptyUser && <Navbar onOpenSidebar={() => setOpen(true)} />}
      {!isEmptyUser && <Sidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />}
      <Box
        sx={(theme: any) => ({
          flexGrow: 1,
          overflow: 'auto',
          minHeight: '100%',
          paddingTop: 11,
          paddingBottom: theme.spacing(10),
          [theme.breakpoints.up('lg')]: {
            paddingTop: 14,
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
          },
          transition: theme.transitions.create('margin', {
            duration: theme.transitions.duration.complex
          }),
          ...(collapseClick && {
            ml: '102px'
          })
        })}
      >
        <Outlet />
      </Box>
    </Box>
  );
});

export default DashboardLayout;
