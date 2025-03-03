import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import YouTube, { YouTubeProps } from 'react-youtube';
import React, { useState } from 'react';
import { varFadeInRight } from '@shared/components/animate';

const HomeVideoWrapper = styled((props: any) => <motion.div variants={varFadeInRight} {...props} />)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  margin: 'auto',
  marginTop: '20px',
  width: '700px',
  [theme.breakpoints.down('md')]: {
    marginBottom: '80px !important',
    width: '560px',
    height: '315px'
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: '80px !important',
    width: '100%',
    height: 'auto'
  },
  [theme.breakpoints.up('xl')]: {
    width: '700px',
    height: '400px'
  }
}));

export const HomeVideo = (): JSX.Element => {
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.playVideo();
  };

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%'
  };

  const loadYTPlayer = (): void => {
    setIsPlayerLoaded(true);
  };

  return (
    <HomeVideoWrapper>
      {isPlayerLoaded ? (
        <Box sx={{ width: '100%', height: '100%' }}>
          <YouTube
            videoId="XkfXtHb0pfg"
            opts={opts}
            loading="lazy"
            onReady={onPlayerReady}
            style={{ height: '100%', borderRadius: '20px' }}
            iframeClassName={'rounded-2xl'}
          />
        </Box>
      ) : (
        <Box onClick={loadYTPlayer} sx={{ width: '100%', height: '100%' }}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              '&::after': {
                content: `''`,
                width: '120px',
                height: '80px',
                display: 'block',
                position: 'absolute',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                cursor: 'pointer',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundImage:
                  'url(https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_play_button_icon_%282013%E2%80%932017%29.svg/800px-YouTube_play_button_icon_%282013%E2%80%932017%29.svg.png)'
              }
            }}
          >
            <img
              id="osiPreview"
              src="https://img.youtube.com/vi/XkfXtHb0pfg/maxresdefault.jpg"
              alt="osiPreview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '16px'
              }}
            />
          </Box>
        </Box>
      )}
    </HomeVideoWrapper>
  );
};
