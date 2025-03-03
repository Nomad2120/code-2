import { observer } from 'mobx-react-lite';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { Box } from '@mui/material';
import { useTranslation } from '@shared/utils/i18n';

interface Props {
  height?: number;
  columns: GridColDef[];
  rows: any;
  isLoading: boolean;
}

export const AccountsDataGrid: React.FC<Props> = observer(({ height, columns, rows, isLoading }) => {
  const { getGridLocale: ggl } = useTranslation();

  return (
    <Box sx={{ height: height || 200 }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        localeText={ggl()}
        hideFooter
        rowHeight={40}
        headerHeight={40}
        loading={isLoading}
        sx={(theme) => ({
          minHeight: '100%',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.mode === 'light' ? '#F4F6F8' : 'rgba(145, 158, 171, 0.16)'
          },
          '& .MuiDataGrid-cell': {
            border: 'none'
          },
          '& .MuiDataGrid-columnHeader': {
            border: 'none'
          }
        })}
      />
    </Box>
  );
});
