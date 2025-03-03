import { Typography } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import classes from './homeFeature.module.scss';

interface CardFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const CardFeature = ({ icon, title, description }: CardFeatureProps) => {
  const theme = useTheme();

  return (
    <div className={classes.card}>
      <div className={classes.media}>{icon}</div>
      <div className={classes.content}>
        <Typography gutterBottom variant="h6" textAlign="center" color={'#000'}>
          {title}
        </Typography>
        <Typography color={theme.palette.grey[600]} variant="subtitle2" textAlign="center">
          {description}
        </Typography>
      </div>
    </div>
  );
};
