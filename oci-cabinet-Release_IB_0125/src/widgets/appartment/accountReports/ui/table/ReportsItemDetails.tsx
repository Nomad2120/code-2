import { observer } from 'mobx-react-lite';
import { DataGridPro, GridColDef, useGridApiRef } from '@mui/x-data-grid-pro';
import { Box } from '@mui/material';
import { useState } from 'react';

interface Props {
  itemDetails: any;
}

export const ReportsItemDetails: React.FC<Props> = observer(({ itemDetails }) => {
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState(itemDetails?.details ?? []);

  const columns: GridColDef[] = [
    { field: 'id' },
    {
      field: 'amount',
      headerName: 'Сумма',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      maxWidth: 200,
      cellClassName: 'amount-cell'
    },
    {
      field: 'comment',
      headerName: 'Комментарий',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      cellClassName: 'comment-cell'
    }
  ];

  return (
    <Box sx={{ mt: '-18px', py: '5px', height: '200px' }}>
      <DataGridPro
        sx={{ height: '100%' }}
        className={'details-grid'}
        hideFooter
        autoHeight
        apiRef={apiRef}
        columns={columns}
        rows={rows}
        rowHeight={40}
        headerHeight={40}
        columnVisibilityModel={{
          id: false
        }}
      />
    </Box>
  );
});
