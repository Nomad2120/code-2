import { useInjection } from 'inversify-react';
import { IOsiPaymentsWidgetViewModel, IOsiPaymentsWidgetViewModelToken } from '@shared/types/mobx/widgets/OsiPayments';
import { observer } from 'mobx-react-lite';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import { useEffect, useMemo } from 'react';
import flatComparator from '@shared/utils/helpers/flatComparator';
import LoadingScreen from '@shared/components/LoadingScreen';
import { Box, Button, Grid, TextField } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import DataGridToolBar from '@shared/common/DataGridToolBar';
import { OsiCreatePaymentButton } from '@features/osi/payments/createPayment';

export const OsiPaymentsWidget: React.FC = observer(() => {
  const vm = useInjection<IOsiPaymentsWidgetViewModel>(IOsiPaymentsWidgetViewModelToken);
  const { translateToken: tt, getGridLocale } = useTranslation();

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'dt',
        headerName: tt(tokens.osiPayments.table.date),
        minWidth: 100,
        type: 'date',
        flex: 0.2,
        valueGetter: (params) => new Date(params.value).toLocaleString('ru-RU')
      },
      { field: 'bankName', headerName: tt(tokens.osiPayments.table.acceptedBank), minWidth: 100, flex: 0.2 },
      {
        field: 'abonentName',
        headerName: tt(tokens.osiPayments.table.abonentName),
        minWidth: 150,
        flex: 0.3
      },
      {
        field: 'flat',
        headerName: tt(tokens.osiPayments.table.number),
        sortComparator: (v1, v2) => flatComparator(v1, v2),
        minWidth: 100,
        flex: 0.2
      },
      { field: 'serviceName', headerName: tt(tokens.osiPayments.table.service), minWidth: 150, flex: 0.3 },
      {
        field: 'amount',
        headerName: tt(tokens.osiPayments.table.amount),
        minWidth: 150,
        flex: 0.2,
        align: 'left',
        type: 'number',
        valueGetter: (params) => params.value.toFixed(2)
      }
    ],
    [tt]
  );

  useEffect(() => {
    if (!vm.period[0] || !vm.period[1]) return;
    vm.loadPayments();
  }, [vm.period, vm]);

  if (vm.isLoading) return <LoadingScreen />;

  return (
    <>
      <Box>
        <OsiCreatePaymentButton onSuccess={vm.loadPayments} />
      </Box>
      <Box display="flex" alignItems="left">
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <DatePicker
              views={['year', 'month']}
              label={tt(tokens.common.formFields.fromMonth.label)}
              minDate={new Date('2021-03-01')}
              maxDate={new Date('2031-03-01')}
              value={vm.dateBegin}
              onChange={(newValue) => {
                vm.dateBegin = newValue;
              }}
              renderInput={(params) => <TextField size="small" {...params} helperText={null} sx={{ width: '100%' }} />}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <DatePicker
              views={['year', 'month']}
              label={tt(tokens.common.formFields.toMonth.label)}
              minDate={new Date('2021-03-01')}
              maxDate={new Date('2031-03-01')}
              value={vm.dateEnd}
              onChange={(newValue) => {
                vm.dateEnd = newValue;
              }}
              renderInput={(params) => <TextField size="small" {...params} helperText={null} sx={{ width: '100%' }} />}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={async () => {
                await vm.loadPayments();
              }}
              size="medium"
            >
              <TranslatedToken id={tokens.common.refresh} />
            </Button>
          </Grid>
          <Grid item xs={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<CloudDownloadIcon />}
              onClick={vm.downloadReport}
              size="medium"
            >
              <TranslatedToken id={tokens.common.download} />
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ height: '62vh' }}>
        <DataGridPro
          localeText={getGridLocale()}
          rows={vm.rows}
          columns={columns}
          density="compact"
          disableSelectionOnClick
          components={{
            Toolbar: DataGridToolBar
          }}
        />
      </Box>
    </>
  );
});
