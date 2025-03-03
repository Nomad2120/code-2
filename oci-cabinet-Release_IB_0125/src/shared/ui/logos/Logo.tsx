import { Box } from '@mui/material';
import logo from '../../icons/logo.png';

interface Props {
  sx?: Record<any, any>;
}

export const Logo = ({ sx }: Props) => (
  <Box sx={{ width: 90, height: 35, ...sx }}>
    <img src={logo} alt="EOSI" width="100%" height="100%" />
  </Box>
);
