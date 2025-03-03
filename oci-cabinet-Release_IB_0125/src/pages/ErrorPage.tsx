import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MaintenanceIllustration from '../shared/assets/illustration_maintenance';

export default function ErrorPage() {
  const navigate = useNavigate();
  const goBackHandler = () => {
    navigate(-1);
  };

  const refreshHandler = () => {
    navigate(0);
  };

  return (
    <Container
      sx={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100dvh',
        width: '100dvw',
        justifyContent: 'center'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h3" paragraph>
          Произошла ошибка при загрузке страницы!
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>Попробуйте вернуться назад или обновить страницу!</Typography>

        <MaintenanceIllustration sx={{ my: 10, height: 240 }} />

        <Box
          sx={{
            display: 'flex',
            gap: '1rem'
          }}
        >
          <Button onClick={goBackHandler} variant="contained" size="large">
            Назад
          </Button>
          <Button onClick={refreshHandler} variant="contained" size="large">
            Обновить
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
