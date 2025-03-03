import { Box, Button, Dialog, DialogActions, DialogContent, Fab, Skeleton, Typography } from '@mui/material';
import YouTube, { YouTubeProps } from 'react-youtube';
import { useState } from 'react';
import clsx from 'clsx';
import InfoIcon from '@mui/icons-material/Info';
import { motion, useMotionValue, animate } from 'framer-motion';
import { tokens, TranslatedToken, useTranslation } from '@/shared/utils/i18n';

interface Props {
  videoId: string;
  labelToken: string;
}

export const WizardStepTutorial = ({ videoId, labelToken }: Props): JSX.Element => {
  const { translateToken: tt } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const textWidth = useMotionValue('0px');

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.playVideo();
    setIsLoading(false);
  };

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%'
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setIsLoading(true);
  };

  const expandIcon = () => {
    animate(textWidth, '200px', { duration: 0.3, ease: 'easeInOut' });
  };

  const collapseIcon = () => {
    animate(textWidth, '0px', { duration: 0.3, ease: 'easeInOut' });
  };

  return (
    <Box display="inline">
      <Fab
        variant="extended"
        size="small"
        color="primary"
        aria-label="help"
        onClick={openDialog}
        sx={{ display: 'inline-flex', justifyContent: 'flex-start', mx: 0 }}
        onMouseEnter={expandIcon}
        onMouseLeave={collapseIcon}
      >
        <Box sx={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box className="flex-none w-[26px]">
            <InfoIcon sx={{ mr: '0!important' }} />
          </Box>
          <motion.div style={{ width: textWidth }} className="overflow-hidden">
            <Typography sx={{ whiteSpace: 'nowrap', textTransform: 'none' }}>
              <TranslatedToken id={tokens.common.howToUse} />
            </Typography>
          </motion.div>
        </Box>
      </Fab>
      <Dialog open={isOpen} maxWidth="lg" fullWidth onClose={closeDialog}>
        <DialogContent>
          <Typography variant="h3">{tt(labelToken)}</Typography>
        </DialogContent>
        <DialogContent className="h-[50vh]">
          <Box className="w-full h-full">
            {isLoading && <Skeleton variant="rectangular" width="100%" height="100%" />}
            <YouTube
              videoId={videoId}
              opts={opts}
              loading="lazy"
              onReady={onPlayerReady}
              className={clsx('h-full', isLoading && 'hidden')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>
            <TranslatedToken id={tokens.common.close} />
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
