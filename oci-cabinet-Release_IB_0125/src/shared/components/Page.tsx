import { Helmet } from 'react-helmet-async';
import { forwardRef, ReactNode } from 'react';
import { Box } from '@mui/material';

interface Props {
  children: ReactNode;
  title: string;
}

const Page = forwardRef<Props, any>(({ children, title = '', ...other }, ref) => (
  <Box ref={ref} {...other}>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    {children}
  </Box>
));

export default Page;
