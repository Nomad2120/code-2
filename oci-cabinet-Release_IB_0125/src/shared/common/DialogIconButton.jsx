import { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Slide,
  Typography
} from '@mui/material';

import { Icon } from '@iconify/react';
import { useTranslation } from '../utils/i18n';

// ----------------------------------------------------------------------

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const DialogIconButton = ({ icon, title, content, label, color, onAgree, onDisagree, className, ...rest }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleClickOpen = (e) => {
    setOpen(true);
    e.stopPropagation();
  };

  const handleClose = (e, agree) => {
    setOpen(false);
    if (agree && typeof onAgree === 'function') onAgree();
    else if (!agree && typeof onDisagree === 'function') onDisagree();
    e.stopPropagation();
  };

  return (
    <div className={className}>
      {icon ? (
        <IconButton onClick={handleClickOpen}>
          <Icon icon={icon} />
        </IconButton>
      ) : (
        <Button variant="outlined" color={color} onClick={handleClickOpen} {...rest}>
          {label}
        </Button>
      )}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={(e) => handleClose(e, false)}>
            <Typography>{t('common:cancel')}</Typography>
          </Button>
          <Button variant="contained" color={color} onClick={(e) => handleClose(e, true)}>
            <Typography>{t('common:accepted')}</Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

DialogIconButton.propTypes = {
  icon: PropTypes.any,
  title: PropTypes.string,
  content: PropTypes.node,
  label: PropTypes.string,
  color: PropTypes.string,
  onAgree: PropTypes.func,
  onDisagree: PropTypes.func
};

export default DialogIconButton;
