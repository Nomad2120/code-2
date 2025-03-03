import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
import blueGrey from '@mui/material/colors/blueGrey';
import { rootContainer } from '@mobx/root';
import { HistoryModule } from '@mobx/services/history';
import { useTranslation } from '../../../shared/utils/i18n';

const history = rootContainer.resolve(HistoryModule);

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: (theme) => theme.customShadows.z8,
  textAlign: 'center',
  height: '100%',
  padding: theme.spacing(5, 0),
  '&:hover': {
    backgroundColor: `${theme.palette.grey.A100} !important`,
    boxShadow: `${theme.shadows[4]} !important`,
    '@media (hover: none)': {
      boxShadow: `${theme.shadows[2]} !important`,
      backgroundColor: `${theme.palette.grey[300]} !important`
    }
  }
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3)
}));

// ----------------------------------------------------------------------

OsiMenuCard.propTypes = {
  title: PropTypes.string,
  path: PropTypes.string,
  icon: PropTypes.any,
  active: PropTypes.bool,
  index: PropTypes.number,
  description: PropTypes.string
};

export default function OsiMenuCard({
  titleToken,
  path,
  icon,
  active,
  index,
  description,
  code,
  allowInFreeMode,
  freeModeSettings
}) {
  const theme = useTheme();
  const { translateToken: tt } = useTranslation();
  const isDark = theme.palette.mode === 'dark';

  let palette = theme.palette.primary;
  switch (index) {
    case 1:
      palette = theme.palette.info;
      break;
    case 2:
      palette = theme.palette.warning;
      break;
    case 3:
      palette = theme.palette.error;
      break;
    default:
  }

  const cardStyle = active
    ? { color: palette.darker, backgroundColor: palette.lighter }
    : {
        color: isDark ? blueGrey.A400 : blueGrey.A400,
        backgroundColor: isDark ? blueGrey['800'] : blueGrey.A100
      };
  const iconStyle = {
    color: active ? palette.dark : blueGrey.A100,
    backgroundImage: `linear-gradient(135deg, ${alpha(palette.dark, 0)} 0%, ${alpha(palette.dark, 0.24)} 100%)`
  };

  return (
    <RootStyle
      sx={cardStyle}
      onClick={() => {
        if (!active || !path) return;

        if (freeModeSettings.enabled && !allowInFreeMode) {
          freeModeSettings.onCardClick();
          return;
        }

        history.navigateTo(path);
      }}
      data-test-id={`menu-card-${code}`}
    >
      {icon && (
        <IconWrapperStyle index={index} sx={iconStyle}>
          <Icon icon={icon} width={24} height={24} />
        </IconWrapperStyle>
      )}
      <Typography variant="h5">{tt(titleToken)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {description}
      </Typography>
      {freeModeSettings.enabled && !allowInFreeMode && (
        <Typography variant="subtitle1" sx={{ opacity: 0.72, color: '#f24726' }}>
          {freeModeSettings.cardDescription}
        </Typography>
      )}
    </RootStyle>
  );
}
