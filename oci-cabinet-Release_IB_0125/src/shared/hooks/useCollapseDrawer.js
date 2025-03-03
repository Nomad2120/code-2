import { useContext } from 'react';
import { CollapseDrawerContext } from '../../app/contexts/CollapseDrawerContext';

// ----------------------------------------------------------------------

const useCollapseDrawer = () => useContext(CollapseDrawerContext);

export default useCollapseDrawer;
