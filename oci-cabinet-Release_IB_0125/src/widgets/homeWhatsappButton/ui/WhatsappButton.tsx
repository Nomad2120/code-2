import React from 'react';
import { Link, Typography } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useScreens } from '@shared/hooks/useScreens';
import classes from './whatsappButton.module.scss';

const mobileContact = {
  href: 'https://wa.me/7076825676',
  text: '+7 707 682 5676'
};
const desktopContact = {
  href: 'https://wa.me/7782044493',
  text: '+7 778 204 4493'
};

const WhatsappButton: React.FC = () => {
  const { isMobile } = useScreens();

  return (
    <Link id={'wa-widget'} href={isMobile ? mobileContact.href : desktopContact.href}>
      <div className={classes.whatsappButton}>
        <WhatsAppIcon />
        <Typography variant="subtitle2">{isMobile ? mobileContact.text : desktopContact.text}</Typography>
      </div>
    </Link>
  );
};

export default WhatsappButton;
