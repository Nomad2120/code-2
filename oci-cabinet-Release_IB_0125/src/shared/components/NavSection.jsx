import PropTypes from 'prop-types';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { matchPath, NavLink as RouterLink, useLocation } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
// material
import { alpha, styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
  Button
} from '@mui/material';
import { useInjection } from 'inversify-react';
import { OsiModule } from '@mobx/services/osiModule';
import { observer } from 'mobx-react-lite';
import { TranslatedToken } from '../utils/i18n/utils/components';
import { useTranslation } from '../utils/i18n/utils/hooks/useTranslation';

// ----------------------------------------------------------------------

const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.overline,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(5),
    color: theme.palette.text.primary
  })
);

const ListItemStyle = styled(ListItemButton)(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: 'relative',
  textTransform: 'capitalize',
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(2.5),
  color: theme.palette.text.secondary,
  '&:before': {
    top: 0,
    right: 0,
    width: 3,
    bottom: 0,
    content: "''",
    display: 'none',
    position: 'absolute',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: theme.palette.primary.main
  }
}));

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

// ----------------------------------------------------------------------

const getIcon = (icon) => <Icon icon={icon} width={32} height={32} />;

const NavItem = observer(({ item, isShow, onClick }) => {
  const theme = useTheme();
  const osiModule = useInjection(OsiModule);
  const { translateToken: tt } = useTranslation();
  const { pathname } = useLocation();
  const { titleToken, path, icon, info, children, active } = item;
  const isActiveRoot = path ? !!matchPath({ path, end: false }, pathname) : false;

  const title = tt(titleToken);

  const [open, setOpen] = useState(isActiveRoot);

  const handleOpen = () => {
    setOpen(!open);
  };

  const activeRootStyle = {
    color: 'primary.main',
    fontWeight: 'fontWeightMedium',
    bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    '&:before': { display: 'block' }
  };

  const activeSubStyle = {
    color: 'text.primary',
    fontWeight: 'fontWeightMedium'
  };

  if (children) {
    return (
      <>
        <ListItemStyle
          onClick={handleOpen}
          sx={{
            ...(isActiveRoot && activeRootStyle)
          }}
        >
          <ListItemIconStyle>{icon && getIcon(icon)}</ListItemIconStyle>

          {isShow && (
            <>
              <ListItemText primary={<Typography variant={'body2'}>{title}</Typography>} />
              {info && info}
              <Box
                component={Icon}
                icon={open ? arrowIosDownwardFill : arrowIosForwardFill}
                sx={{ width: 32, height: 32, ml: 1 }}
              />
            </>
          )}
        </ListItemStyle>

        {isShow && (
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {children.map((item) => {
                const { title, path } = item;
                const isActiveSub = path ? !!matchPath({ path, end: false }, pathname) : false;

                return (
                  <ListItemStyle
                    key={title}
                    component={RouterLink}
                    to={path}
                    sx={{
                      ...(isActiveSub && activeSubStyle)
                    }}
                  >
                    <ListItemIconStyle>
                      <Box
                        component="span"
                        sx={{
                          width: 4,
                          height: 4,
                          display: 'flex',
                          borderRadius: '50%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'text.disabled',
                          transition: (theme) => theme.transitions.create('transform'),
                          ...(isActiveSub && {
                            transform: 'scale(2)',
                            bgcolor: 'primary.main'
                          })
                        }}
                      />
                    </ListItemIconStyle>
                    <ListItemText primary={<Typography variant={'body2'}>{title}</Typography>} />
                  </ListItemStyle>
                );
              })}
            </List>
          </Collapse>
        )}
      </>
    );
  }

  return (
    <ListItemStyle
      component={RouterLink}
      onClick={osiModule.isFreeMode && !item.allowInFreeMode ? onClick : undefined}
      to={osiModule.isFreeMode && !item.allowInFreeMode ? '' : path}
      sx={{
        ...(isActiveRoot && activeRootStyle)
      }}
    >
      <ListItemIconStyle>{icon && getIcon(icon)}</ListItemIconStyle>
      {isShow && (
        <>
          <ListItemText primary={<Typography variant={'body2'}>{title}</Typography>} />
          {info && info}
        </>
      )}
    </ListItemStyle>
  );
});

NavItem.propTypes = {
  isShow: PropTypes.bool,
  item: PropTypes.object
};

NavSection.propTypes = {
  isShow: PropTypes.bool,
  navConfig: PropTypes.array
};

export default function NavSection({ navConfig, isShow = true, onClick, ...other }) {
  return (
    <Box {...other}>
      {navConfig.map((list) => {
        const { subheaderToken, items } = list;
        return (
          <List key={subheaderToken} disablePadding>
            {isShow && (
              <ListSubheaderStyle>
                <TranslatedToken id={subheaderToken} />
              </ListSubheaderStyle>
            )}
            {items?.map((item, key) => (
              <NavItem key={key} item={item} isShow={isShow} onClick={onClick} />
            ))}
          </List>
        );
      })}
    </Box>
  );
}
