import { Card } from '@mui/material';
import React, { ReactNode } from 'react';

interface OsiCardProps {
  children: ReactNode;
  sx: any;
}

export const OsiCard = ({ children, sx }: OsiCardProps) => <Card sx={sx}>{children}</Card>;
