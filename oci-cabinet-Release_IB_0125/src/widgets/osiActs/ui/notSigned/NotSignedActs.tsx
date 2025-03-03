import { OsiActsWidgetViewModel } from '@widgets/osiActs/model/viewModel';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { Box, Button, Card, CardHeader, Typography } from '@mui/material';
import { useTranslation } from '@shared/utils/i18n';
import { NotSignedActsDialog } from '@widgets/osiActs/ui/notSigned/NotSignedActsDialog';

interface Props {
  viewModel: OsiActsWidgetViewModel;
}

export const NotSignedActs: React.FC<Props> = observer(({ viewModel }) => {
  const acts = viewModel.notSignedActs;
  const [pageSize, setPageSize] = useState(5);
  const { getGridLocale: ggl, getGridPaginationLocaleProps, t } = useTranslation();

  const columns: GridColDef[] = [
    {
      field: 'action',
      headerName: '',
      renderCell: (params) => (
        <Button
          onClick={() => {
            viewModel.onSignActClick(params.row.id);
          }}
        >
          {t('common:sign')}
        </Button>
      )
    },
    { field: 'actNum', headerName: t('acts:notSignedActs.actNumber'), minWidth: 200 },
    {
      field: 'actPeriod',
      headerName: t('acts:notSignedActs.period'),
      minWidth: 200,
      valueFormatter: (params) => {
        const dt = new Date(params.value);
        return dt.toLocaleString('ru-RU', { year: 'numeric', month: 'long' });
      }
    },
    { field: 'stateName', headerName: t('acts:notSignedActs.state'), minWidth: 200 },
    {
      field: 'amount',
      headerName: t('acts:notSignedActs.amount'),
      minWidth: 170,
      align: 'right',
      valueFormatter: (params) => params.value.toFixed(2)
    },
    {
      field: 'createDt',
      headerName: t('acts:notSignedActs.createDate'),
      minWidth: 170,
      valueFormatter: (params) => new Date(params.value).toLocaleString('ru-RU')
    }
  ];

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Card>
        <CardHeader
          subheader={
            <Box sx={{ mb: { md: 2 } }}>
              <Typography variant="h5" color="textPrimary">
                <span>{t('acts:notSignedActs.title')}</span>
              </Typography>
            </Box>
          }
        />
        <DataGridPro
          columns={columns}
          rows={acts}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          localeText={ggl()}
          componentsProps={{
            ...getGridPaginationLocaleProps()
          }}
        />
      </Card>
      <NotSignedActsDialog viewModel={viewModel} />
    </Box>
  );
});
