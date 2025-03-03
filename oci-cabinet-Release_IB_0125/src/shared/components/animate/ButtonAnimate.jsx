import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
// material
import { Box } from '@mui/material';
//
import { varSmallClick, varMediumClick } from './variants';

// ----------------------------------------------------------------------

ButtonAnimate.propTypes = {
  mediumClick: PropTypes.bool,
  sx: PropTypes.object,
  children: PropTypes.node
};

export default function ButtonAnimate({ mediumClick = false, sx = {}, children, ...other }) {
  return (
    <Box
      component={motion.div}
      whileTap="tap"
      whileHover="hover"
      variants={mediumClick ? varMediumClick : varSmallClick}
      sx={{ display: 'inline-flex', ...sx }}
      {...other}
    >
      {children}
    </Box>
  );
}
