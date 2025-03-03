import PropTypes from 'prop-types';
import { Box, Checkbox } from '@mui/material';
import { DataGridPro, useGridApiRef, gridVisibleSortedRowIdsSelector } from '@mui/x-data-grid-pro';
import DataGridToolBar from '../DataGridToolBar';
import GridTreeDataGroupingCell from './GridTreeDataGroupingCell';
import StateFooter from './StateFooter';
import { useTranslation } from '../../utils/i18n';

const OsvGrid = ({ columns, rows, totals, rowCount, getTreeDataPath }) => {
  const apiRef = useGridApiRef();

  const { getGridLocale } = useTranslation();

  const handleExpandAllClick = () => {
    const rowIds = gridVisibleSortedRowIdsSelector(apiRef.current.state);
    if (rows.length > 1) {
      rowIds.forEach((rowId) =>
        apiRef.current.setRowChildrenExpansion(rowId, !apiRef.current.getRowNode(rowId)?.childrenExpanded)
      );
    }
  };

  const isExpanded = () => {
    const rowIds = gridVisibleSortedRowIdsSelector(apiRef.current.state);

    if (rows.length > 1) {
      const expanded = rowIds.reduce((count, rowId) => {
        if (apiRef.current.getRowNode(rowId)?.childrenExpanded) {
          return count + 1;
        }
        return count;
      }, 0);
      return expanded === rowCount || expanded === rows?.length;
    }
    return false;
  };

  const groupingColDef = {
    headerName: '',
    align: 'left',
    width: 60,
    renderHeader: () => (
      <Box sx={{ ml: -1 }}>
        <Checkbox checked={isExpanded()} onChange={handleExpandAllClick} />
      </Box>
    ),
    renderCell: (params) => <GridTreeDataGroupingCell {...params} />
  };

  return (
    <DataGridPro
      localeText={getGridLocale()}
      treeData
      apiRef={apiRef}
      getTreeDataPath={getTreeDataPath}
      groupingColDef={groupingColDef}
      getRowClassName={(params) => `row-child--level-${params.getValue(params.id, 'level')}`}
      rows={rows}
      columns={columns}
      disableChildrenFiltering
      density="compact"
      disableSelectionOnClick
      hideFooter={!totals}
      components={{
        Toolbar: DataGridToolBar,
        Footer: StateFooter
      }}
      componentsProps={{
        footer: { totals }
      }}
    />
  );
};

OsvGrid.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  totals: PropTypes.array,
  rowCount: PropTypes.any.isRequired,
  getTreeDataPath: PropTypes.func.isRequired
};

export default OsvGrid;
