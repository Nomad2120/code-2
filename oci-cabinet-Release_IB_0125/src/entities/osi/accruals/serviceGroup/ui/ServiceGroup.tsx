import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';

interface Props {
  title: string;
  RightTitleSlot?: ReactNode;
  children: ReactNode;
}

export const ServiceGroup: React.FC<Props> = observer(({ title, RightTitleSlot, children }) => {
  const test = [];
  return (
    <Card sx={{ mt: 2, maxWidth: 1000, minWidth: 800 }}>
      <CardHeader
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant={'h5'} color={'textPrimary'}>
              {title}
            </Typography>
            {RightTitleSlot}
          </Box>
        }
      />
      <CardContent>{children}</CardContent>
    </Card>
  );
});
