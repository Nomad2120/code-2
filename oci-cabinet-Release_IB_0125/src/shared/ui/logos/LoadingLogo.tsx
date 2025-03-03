import { Box } from '@mui/material';
import logo from '../../icons/loading.png';

interface Props {
  sx?: Record<any, any>;
}

export const LoadingLogo = ({ sx }: Props) => (
  <Box sx={{ width: 40, height: 40, ...sx }}>
    <img src={logo} alt="EOSI" />
  </Box>
);
