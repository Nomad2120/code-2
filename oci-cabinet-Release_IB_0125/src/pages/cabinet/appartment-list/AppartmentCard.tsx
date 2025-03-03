import { Icon } from '@iconify/react';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { AppartmentsModule } from '@mobx/services/appartments';

const RootStyle = styled(Card)(({ theme }) => ({
  // @ts-expect-error not typed
  boxShadow: theme.customShadows.z8,
  textAlign: 'center',
  height: '100%',
  '&:hover': {
    // @ts-expect-error not typed
    backgroundColor: `${theme.palette.secondary.lighter} !important`,
    boxShadow: `${theme.shadows[4]} !important`,
    '@media (hover: none)': {
      boxShadow: `${theme.shadows[2]} !important`,
      // @ts-expect-error not typed
      backgroundColor: `${theme.palette.secondary.lighter} !important`
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
  flat: any;
  address: any;
  abonentId: number;
  icon: any;
  osiName: any;
  index: number;
}

export const AppartmentCard: React.FC<Props> = observer(({ flat, address, abonentId, icon, osiName, index }) => {
  const appartmentsModule = useInjection(AppartmentsModule);
  const theme = useTheme();

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

  // @ts-expect-error not typed
  const cardStyle = { color: palette.darker, backgroundColor: palette.lighter };
  const iconStyle = {
    color: palette.dark,
    backgroundImage: `linear-gradient(135deg, ${alpha(palette.dark, 0)} 0%, ${alpha(palette.dark, 0.24)} 100%)`
  };

  return (
    <RootStyle
      sx={cardStyle}
      onClick={() => {
        appartmentsModule.selectAppartment(abonentId);
      }}
    >
      <CardContent sx={{ height: '75%' }}>
        <Stack direction="column" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
          {icon && (
            // @ts-expect-error not typed
            <IconWrapperStyle index={index} sx={iconStyle}>
              <Icon icon={icon} width={24} height={24} />
            </IconWrapperStyle>
          )}
          <Box>
            <Typography variant="h4">{osiName}</Typography>
            <Typography variant="body1" sx={{ ml: 0.25, textAlign: 'start', opacity: 0.72 }}>
              {`${address}, ${flat}`}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </RootStyle>
  );
});
