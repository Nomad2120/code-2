import { Icon } from '@iconify/react';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
import blueGrey from '@mui/material/colors/blueGrey';
import { rootContainer } from '@mobx/root';
import { HistoryModule } from '@mobx/services/history';
import { observer } from 'mobx-react-lite';
import { useTranslation } from '@shared/utils/i18n';

const history = rootContainer.resolve(HistoryModule);

const RootStyle = styled(Card)(({ theme }) => ({
  // @ts-expect-error not typed
  boxShadow: theme.customShadows.z8,
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

interface Props {
  title: string;
  path: string;
  icon: any;
  active: boolean;
  index: number;
}

export const AppartmentMenuCard: React.FC<Props> = observer(({ title, path, icon, active, index }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { translateToken: tt } = useTranslation();

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
    ? // @ts-expect-error not typed
      { color: palette.darker, backgroundColor: palette.lighter }
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
        history.navigateTo(path);
      }}
    >
      {icon && (
        <IconWrapperStyle sx={iconStyle}>
          <Icon icon={icon} width={24} height={24} />
        </IconWrapperStyle>
      )}
      <Typography variant="h5">{tt(title)}</Typography>
    </RootStyle>
  );
});
