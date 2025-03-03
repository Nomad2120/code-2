import PropTypes from 'prop-types';

import { Box, IconButton } from '@mui/material';
import {
  useGridApiContext,
  GridEvents,
  useGridSelector,
  gridFilteredDescendantCountLookupSelector
} from '@mui/x-data-grid-pro';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const isNavigationKey = (key) =>
  key === 'Home' || key === 'End' || key.indexOf('Arrow') === 0 || key.indexOf('Page') === 0 || key === ' ';

const GridTreeDataGroupingCell = (props) => {
  const { id, field, rowNode, margin = 4 } = props;
  const apiRef = useGridApiContext();
  const filteredDescendantCountLookup = useGridSelector(apiRef, gridFilteredDescendantCountLookupSelector);

  const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0;

  const handleKeyDown = (event) => {
    if (event.key === ' ') {
      event.stopPropagation();
    }
    if (isNavigationKey(event.key) && !event.shiftKey) {
      apiRef.current.publishEvent(GridEvents.cellNavigationKeyDown, props, event);
    }
  };

  const handleClick = (event) => {
    apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
    apiRef.current.setCellFocus(id, field);
    event.stopPropagation();
  };

  return (
    <Box sx={{ ml: rowNode.depth * margin }}>
      <div>
        {filteredDescendantCount > 0 ? (
          <IconButton aria-label="expand row" size="small" onClick={handleClick} onKeyDown={handleKeyDown}>
            {rowNode.childrenExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        ) : (
          <span />
        )}
      </div>
    </Box>
  );
};

GridTreeDataGroupingCell.propTypes = { id: PropTypes.any, field: PropTypes.any, rowNode: PropTypes.any };

export default GridTreeDataGroupingCell;
