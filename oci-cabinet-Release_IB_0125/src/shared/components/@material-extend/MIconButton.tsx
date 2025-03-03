import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { IconButton } from '@mui/material';
import { ButtonAnimate } from '../animate';

interface Props {
  [key: string]: any;
}

const MIconButton = forwardRef<HTMLButtonElement, Props>(({ children, ...other }, ref) => (
  <ButtonAnimate
    children={
      <IconButton ref={ref} {...other}>
        {children}
      </IconButton>
    }
    sx={{}}
  />
));

MIconButton.propTypes = {
  children: PropTypes.node
};

export default MIconButton;
