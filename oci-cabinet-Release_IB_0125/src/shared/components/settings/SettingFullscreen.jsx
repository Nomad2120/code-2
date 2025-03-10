import { useState } from 'react';
import { Icon } from '@iconify/react';
import roundFullscreen from '@iconify/icons-ic/round-fullscreen';
import roundFullscreenExit from '@iconify/icons-ic/round-fullscreen-exit';
// material
import { alpha } from '@mui/material/styles';
import { Button } from '@mui/material';
import { useTranslation } from '../../utils/i18n/utils/hooks/useTranslation';
import { tokens } from '../../utils/i18n/messages';

// ----------------------------------------------------------------------

export default function SettingFullscreen() {
  const [fullscreen, setFullscreen] = useState(false);
  const { translateToken: tt } = useTranslation();

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  return (
    <Button
      fullWidth
      size="large"
      variant="outlined"
      color={fullscreen ? 'primary' : 'inherit'}
      startIcon={<Icon icon={fullscreen ? roundFullscreenExit : roundFullscreen} />}
      onClick={toggleFullScreen}
      sx={{
        fontSize: 14,
        ...(fullscreen && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
        })
      }}
    >
      {fullscreen ? tt(tokens.common.standard) : tt(tokens.common.fullScreen)}
    </Button>
  );
}
