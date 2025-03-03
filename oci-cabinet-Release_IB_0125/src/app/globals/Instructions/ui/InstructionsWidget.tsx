import { Drawer, IconButton, Box, DialogContent, Dialog, DialogTitle, Card } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useInjection } from 'inversify-react';
import { InstructionsModule } from '@mobx/services/instructions';
import { styled, useTheme } from '@mui/material/styles';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useScreens } from '@shared/hooks/useScreens';

const DrawerStyled = styled(Drawer)<{ isOpen: boolean; isAuth: boolean }>(({ theme, isOpen, isAuth }) => ({
  width: isOpen ? 900 : 0,
  position: 'absolute',
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: isOpen ? 900 : 0,
    boxSizing: 'border-box',
    border: 'none',
    backgroundColor: 'transparent',
    zIndex: isAuth && 1301,

    [theme.breakpoints.down('md')]: {
      width: isOpen ? 600 : 0
    }
  },
  [theme.breakpoints.down('md')]: {
    width: isOpen ? 600 : 0
  }
}));

const DrawerBody = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
  paddingLeft: '20px'
});

const PlayerWrapper = styled(Card)(({ theme }) => ({
  width: '100%',
  height: '100%',
  paddingInline: '5px',
  paddingBlock: '5px',
  alignSelf: 'flex-start',
  borderRadius: '20px',
  background: '#212B36',
  'div, iframe': {
    borderRadius: '14px',
    boxShadow: theme.shadows[10]
  }
}));

const PlayerWrapperCloseIcon = styled(Box)(({ theme }) => ({
  alignSelf: 'flex-start',
  borderRadius: '20px',
  background: '#212B36',
  boxShadow: theme.shadows[10],
  position: 'absolute',
  top: '-11%',

  '&:before': {
    content: `''`,
    position: 'absolute',
    background: '#212B36',
    height: '50px',
    width: '40px',
    bottom: '-30px'
  }
}));

export const InstructionsWidget: React.FC = observer(() => {
  const theme = useTheme();
  const location = useLocation();
  const instructionsModule = useInjection<InstructionsModule>(InstructionsModule);
  const playerRef = useRef<any>(null);
  const { isMobile } = useScreens();

  const isAuth = location.pathname.split('/').includes('auth');

  useEffect(() => {
    instructionsModule.location = location;
  }, [instructionsModule, location]);

  useEffect(() => {
    instructionsModule.player = playerRef.current;
  }, [instructionsModule]);

  const handleDrawerClose = () => {
    instructionsModule.isDrawerOpen = false;
  };

  if (isMobile) {
    return (
      <Dialog
        sx={{ '& .MuiPaper-root': { height: '40%' } }}
        open={instructionsModule.isDrawerOpen}
        onClose={handleDrawerClose}
        fullWidth
        keepMounted
      >
        <DialogTitle sx={{ justifyContent: 'flex-end', display: 'flex' }}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box
            sx={{
              maxWidth: 500,
              maxHeight: 280,
              width: '100%',
              height: '100%',
              borderRadius: '20px',
              'div, iframe': {
                borderRadius: '20px'
              }
            }}
          >
            <ReactPlayer
              ref={playerRef}
              width={'100%'}
              height={'100%'}
              style={{ borderRadius: '20px' }}
              light
              url={instructionsModule.currentInstruction}
              playing={instructionsModule.isDrawerOpen}
              controls
            />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <DrawerStyled
      isOpen={instructionsModule.isDrawerOpen}
      variant="persistent"
      anchor={'right'}
      open={instructionsModule.isDrawerOpen}
      isAuth={isAuth}
    >
      <DrawerBody id={'dr-body'}>
        <Box sx={{ position: 'relative', width: '100%', height: { sm: '290px', md: '438px' } }}>
          <PlayerWrapperCloseIcon>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </PlayerWrapperCloseIcon>
          <PlayerWrapper elevation={10} id={'dr-player'}>
            <ReactPlayer
              ref={playerRef}
              width={'auto'}
              height={'auto'}
              style={{ borderRadius: '14px', position: 'absolute', inset: '10px' }}
              light
              url={instructionsModule.currentInstruction}
              playing={instructionsModule.isDrawerOpen}
              controls
            />
          </PlayerWrapper>
        </Box>
      </DrawerBody>
    </DrawerStyled>
  );
});
