import PropTypes from 'prop-types';
import LoadingScreen from './LoadingScreen';

const LoadingWrapper = ({ children }) => (
  <div
    style={{
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1001,
      width: '100vw',
      height: '100vh'
    }}
  >
    <LoadingScreen />
  </div>
);

LoadingWrapper.propTypes = {
  children: PropTypes.node
};

export default LoadingWrapper;
