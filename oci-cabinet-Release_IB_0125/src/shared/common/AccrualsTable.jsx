import PropTypes from 'prop-types';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import GridTreeDataGroupingCell from './OsvGrid/GridTreeDataGroupingCell';
import { useTranslation } from '../utils/i18n';

const AccrualsTable = ({ rows, columns }) => {
  const apiRef = useGridApiRef();
  const { getGridLocale } = useTranslation();

  const groupingColDef = {
    headerName: '',
    align: 'left',
    width: 60,
    renderCell: (params) => <GridTreeDataGroupingCell {...params} />
  };

  return (
    <DataGridPro
      localeText={getGridLocale()}
      treeData
      apiRef={apiRef}
      getTreeDataPath={(row) => row?.groupName}
      groupingColDef={groupingColDef}
      getRowClassName={(params) => `row-child--level-${params.getValue(params.id, 'level')}`}
      rows={rows}
      columns={columns}
      disableChildrenFiltering
      density="compact"
      disableSelectionOnClick
    />
  );
};

AccrualsTable.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired
};

export default AccrualsTable;
