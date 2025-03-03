import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Button, Typography, Container } from '@mui/material';
// components
import Page from '../shared/components/Page';
//
import { MaintenanceIllustration } from '../shared/assets';
import useCountdown from '../shared/hooks/useCountdown';
import Countdown from './Countdown';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  minHeight: '100%',
  display: 'flex',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------
const NotWorkDate = new Date('04/01/2022 21:30');

export default function Maintenance() {
  const countdown = useCountdown(NotWorkDate);
  const isExpire = NotWorkDate < new Date();
  return (
    <RootStyle title="Maintenance | Minimal-UI">
      <Container sx={{ textAlign: 'center' }}>
        <Typography variant="h3" paragraph>
          Проводятся технические работы
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          Приносим свои извенения! {!isExpire ? 'Осталось...' : ''}
        </Typography>

        {!isExpire && <Countdown countdown={countdown} />}

        <MaintenanceIllustration sx={{ my: 10, height: 240 }} />

        <Button variant="contained" size="large" component={RouterLink} to="/">
          Домой
        </Button>
      </Container>
    </RootStyle>
  );
}
