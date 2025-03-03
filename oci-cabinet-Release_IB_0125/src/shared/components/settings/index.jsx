import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import options2Fill from '@iconify/icons-eva/options-2-fill';
// material
import { Backdrop, Box, Divider, Paper, Stack, Tooltip, Typography } from '@mui/material';
//
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';
import { useInjection } from 'inversify-react';
import { InstructionsModule } from '@mobx/services/instructions';
import { TranslatedToken, tokens, useTranslation } from '@shared/utils/i18n';
import Scrollbar from '../Scrollbar';
import SettingMode from './SettingMode';
import SettingColor from './SettingColor';
import SettingStretch from './SettingStretch';
import SettingFullscreen from './SettingFullscreen';
import { SettingsLanguage } from './SettingsLanguage';
import { MIconButton } from '../@material-extend';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 260;

export default observer(() => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { translateToken: tt } = useTranslation();
  const instructionModule = useInjection(InstructionsModule);
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [open]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!instructionModule.isDrawerOpen) return;
    handleClose();
  }, [instructionModule.isDrawerOpen]);

  if (location.pathname === '/') return null;

  return (
    <>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={handleClose} />

      <Box
        sx={{
          top: 12,
          bottom: 12,
          right: 0,
          position: 'fixed',
          zIndex: 2001,
          ...(open && { right: 12 })
        }}
      >
        <Box
          sx={{
            visibility: instructionModule.isDrawerOpen && 'hidden',
            p: 0.5,
            px: '4px',
            mt: -3,
            left: -44,
            top: '50%',
            color: 'grey.800',
            position: 'absolute',
            bgcolor: 'common.white',
            borderRadius: '24px 0 16px 24px',
            boxShadow: (theme) => theme.customShadows.z12
          }}
        >
          <Tooltip title={tt(tokens.common.settings)}>
            <MIconButton
              color="inherit"
              onClick={handleToggle}
              sx={{
                p: 0,
                width: 40,
                height: 40,
                transition: (theme) => theme.transitions.create('all'),
                '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
              }}
            >
              <Icon icon={open ? closeFill : options2Fill} width={20} height={20} />
            </MIconButton>
          </Tooltip>
        </Box>

        <Paper
          sx={{
            height: 1,
            width: '0px',
            overflow: 'hidden',
            boxShadow: (theme) => theme.customShadows.z24,
            transition: (theme) => theme.transitions.create('width'),
            ...(open && { width: DRAWER_WIDTH })
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2, pr: 1, pl: 2.5 }}>
            <Typography variant="subtitle1">
              <TranslatedToken id={tokens.common.settings} />
            </Typography>
            <MIconButton onClick={handleClose}>
              <Icon icon={closeFill} width={20} height={20} />
            </MIconButton>
          </Stack>
          <Divider />

          <Scrollbar sx={{ height: 1 }}>
            <Stack spacing={4} sx={{ pt: 3, px: 3, pb: 15 }}>
              <Stack spacing={1.5}>
                <Typography variant="subtitle2">
                  <TranslatedToken id={tokens.common.theme} />
                </Typography>
                <SettingMode />
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">
                  <TranslatedToken id={tokens.common.color} />
                </Typography>
                <SettingColor />
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">
                  <TranslatedToken id={tokens.common.size} />
                </Typography>
                <SettingStretch />
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">
                  <TranslatedToken id={tokens.common.language} />
                </Typography>
                <SettingsLanguage />
              </Stack>

              <SettingFullscreen />
            </Stack>
          </Scrollbar>
        </Paper>
      </Box>
    </>
  );
});
