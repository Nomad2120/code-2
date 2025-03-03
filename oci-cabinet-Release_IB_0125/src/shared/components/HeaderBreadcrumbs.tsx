import { Box, Typography } from '@mui/material';
import { MBreadcrumbs } from '@shared/components/@material-extend';
import { ReactNode } from 'react';

interface Breadcrumb {
  name: string;
  href?: string;
}

interface Props {
  links?: Breadcrumb[];
  action?: ReactNode;
  heading: string | undefined;
  moreLink?: ReactNode[];
  sx?: any;
}

const HeaderBreadcrumbs: React.FC<Props> = ({ links, action, heading, moreLink = '' || [], sx, ...other }) => (
  <Box sx={{ mb: 5, ...sx }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          {heading}
        </Typography>
        <MBreadcrumbs links={links} {...other} />
      </Box>

      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  </Box>
);

export default HeaderBreadcrumbs;
