import { OsiActsWidgetViewModel } from '@widgets/osiActs/model/viewModel';
import { observer } from 'mobx-react-lite';
import { Box, Button, Card, CardHeader, Typography } from '@mui/material';
import { useTranslation } from '@shared/utils/i18n';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { useState } from 'react';
import { SignedActsDialog } from '@widgets/osiActs/ui/signed/SignedActsDialog';

interface Props {
  viewModel: OsiActsWidgetViewModel;
}

export const SignedActs: React.FC<Props> = observer(({ viewModel }) => {
  const acts = viewModel.signedActs;
  const [pageSize, setPageSize] = useState(5);
  const { getGridLocale, getGridPaginationLocaleProps, t } = useTranslation();

  const columns: GridColDef[] = [
    {
      field: 'action',
      headerName: '',
      renderCell: (params) => (
        <Button
          onClick={() => {
            viewModel.onShowSignedActClick(params.row.id);
          }}
        >
          {t('common:view')}
        </Button>
      )
    },
    { field: 'actNum', headerName: t('acts:signedActs.actNumber'), minWidth: 200 },
    {
      field: 'actPeriod',
      headerName: t('acts:signedActs.period'),
      minWidth: 200,
      valueFormatter: (params) => {
        const dt = new Date(params.value);
        return dt.toLocaleString('ru-RU', { year: 'numeric', month: 'long' });
      }
    },
    { field: 'stateName', headerName: t('acts:signedActs.state'), minWidth: 200 },
    {
      field: 'amount',
      headerName: t('acts:signedActs.amount'),
      minWidth: 170,
      align: 'right',
      valueFormatter: (params) => params.value.toFixed(2)
    },
    {
      field: 'createDt',
      headerName: t('acts:signedActs.createDate'),
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
                <span>{t('acts:signedActs.title')}</span>
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
          localeText={getGridLocale()}
          componentsProps={{
            ...getGridPaginationLocaleProps()
          }}
        />
      </Card>
      <SignedActsDialog viewModel={viewModel} />
    </Box>
  );
});
