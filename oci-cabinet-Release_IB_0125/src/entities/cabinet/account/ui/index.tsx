import { tokens, TranslatedToken } from '@shared/utils/i18n';
import React, { useRef } from 'react';
import { alpha } from '@mui/material/styles';
import { Avatar, Box, Button, Divider, MenuItem, Typography } from '@mui/material';
import MenuPopover from '@shared/components/MenuPopover';
import { formatPhone } from '@shared/utils/helpers/formatString';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { MIconButton } from '@shared/components/@material-extend';
import { CabinetAccountViewModel } from '@entities/cabinet/account/model';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { MENU_OPTIONS } from '../constants';

export const AccountPopover: React.FC = observer(() => {
  const viewModel = useInjection(CabinetAccountViewModel);
  const anchorRef = useRef(null);

  const handleOpen = () => {
    viewModel.open();
  };
  const handleClose = () => {
    viewModel.close();
  };

  const handleLogout = async () => {
    viewModel.logout();
    handleClose();
  };

  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(viewModel.isOpen && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme: any) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <Avatar alt="My Avatar" src="/static/mock-images/avatars/avatar_default.jpg" />
      </MIconButton>

      <MenuPopover open={viewModel.isOpen} onClose={handleClose} anchorEl={anchorRef.current} sx={{ width: 220 }}>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {viewModel.userInfo.fio}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {formatPhone(viewModel.userInfo.phone)}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Box
              component={Icon}
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />

            <TranslatedToken id={option.labelToken} />
            {/* {option.label} */}
          </MenuItem>
        ))}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={handleLogout}>
            <TranslatedToken id={tokens.common.exit} />
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
});
