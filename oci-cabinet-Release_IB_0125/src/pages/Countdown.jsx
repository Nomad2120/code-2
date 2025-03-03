import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

// ----------------------------------------------------------------------

const MarginDiv = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2)
}));

// ----------------------------------------------------------------------

const LABELS = {
  days: ['День', 'Дня', 'Дней'],
  hours: ['Час', 'Часа', 'Часов'],
  minutes: ['Минута', 'Минуты', 'Минут'],
  seconds: ['Секунда', 'Секунды', 'Секунд']
};

const getLabel = (type, value) => {
  if (typeof value === 'string') value = parseInt(value, 10) || 0;
  if (!LABELS[type]) return '';
  if (value > 4 && value < 21) return LABELS[type][2];
  if (value === 1 || value % 10 === 1) return LABELS[type][0];
  if (value % 10 > 1 && value % 10 < 5) return LABELS[type][1];
  return LABELS[type][2];
};

const Countdown = ({ countdown }) => (
  <Box display="flex" justifyContent="center">
    <MarginDiv>
      <Typography variant="h2">{countdown.days}</Typography>
      <Typography color="textSecondary">{getLabel('days', countdown.days)}</Typography>
    </MarginDiv>

    <Typography variant="h2" bx={{ mt: 1 }}>
      :
    </Typography>

    <MarginDiv>
      <Typography variant="h2">{countdown.hours}</Typography>
      <Typography color="textSecondary">{getLabel('hours', countdown.hours)}</Typography>
    </MarginDiv>

    <Typography variant="h2" bx={{ mt: 1 }}>
      :
    </Typography>

    <MarginDiv>
      <Typography variant="h2">{countdown.minutes}</Typography>
      <Typography color="textSecondary">{getLabel('minutes', countdown.minutes)}</Typography>
    </MarginDiv>

    <Typography variant="h2" bx={{ mt: 1 }}>
      :
    </Typography>

    <MarginDiv>
      <Typography variant="h2">{countdown.seconds}</Typography>
      <Typography color="textSecondary">{getLabel('seconds', countdown.seconds)}</Typography>
    </MarginDiv>
  </Box>
);

Countdown.propTypes = {
  countdown: PropTypes.object
};

export default Countdown;
