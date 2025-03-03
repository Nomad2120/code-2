import ReactPlayer from 'react-player';
import { Box, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';

const link = 'https://youtu.be/iJmoY4KRwG0';

export const Instruction: React.FC = observer(() => (
  <Box
    sx={{
      height: '250px',
      width: '100%',
      margin: 'auto',
      maxWidth: '480px',
      borderRadius: '20px',

      'div, iframe': {
        borderRadius: '20px'
      }
    }}
  >
    <Typography sx={{ mb: 2 }} align={'center'}>
      Видеоинструкция по регистрации в системе
    </Typography>
    <ReactPlayer width={'100%'} height={'100%'} style={{ borderRadius: '20px' }} light url={link} playing controls />
  </Box>
));
