import {
  IOsiCorrectionWidgetViewModel,
  IOsiCorrectionWidgetViewModelToken
} from '@shared/types/mobx/widgets/OsiCorrection';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { useEffect, useMemo } from 'react';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import flatComparator from '@shared/utils/helpers/flatComparator';
import LoadingScreen from '@shared/components/LoadingScreen';
import { Box, Button, TextField } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { DataGridPro, GridColDef, GridValueGetterParams } from '@mui/x-data-grid-pro';
import DataGridToolBar from '@shared/common/DataGridToolBar';
import { OsiCreateCorrectionButton } from '@features/osi/correction/createCorrection';

export const OsiCorrectionWidget: React.FC = observer(() => {
  const vm = useInjection<IOsiCorrectionWidgetViewModel>(IOsiCorrectionWidgetViewModelToken);

  const { translateToken: tt, getGridLocale } = useTranslation();

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'dt',
        headerName: tt(tokens.osiPayments.table.date),
        minWidth: 100,
        type: 'date',
        flex: 0.2,
        valueGetter: (params: GridValueGetterParams) => new Date(params.value).toLocaleString('ru-RU')
      },
      {
        field: 'abonentName',
        headerName: tt(tokens.osiPayments.table.abonentName),
        minWidth: 150,
        flex: 0.3
      },
      {
        field: 'flat',
        headerName: tt(tokens.osiPayments.table.number),
        sortComparator: flatComparator,
        minWidth: 100,
        flex: 0.2
      },
      { field: 'serviceName', headerName: tt(tokens.osiPayments.table.service), minWidth: 150, flex: 0.3 },
      { field: 'reason', headerName: tt(tokens.osiPayments.table.reason), minWidth: 100, flex: 0.3 },
      {
        field: 'amount',
        headerName: tt(tokens.osiPayments.table.amount),
        minWidth: 150,
        flex: 0.2,
        align: 'left',
        type: 'number',
        valueGetter: (params: GridValueGetterParams) => params.value.toFixed(2)
      }
    ],
    [tt]
  );

  useEffect(() => {
    if (!vm.period[0] || !vm.period[1]) return;
    vm.loadFixes();
  }, [vm.period, vm]);

  if (vm.isLoading) return <LoadingScreen />;

  return (
    <>
      <Box>
        <OsiCreateCorrectionButton onSuccess={vm.loadFixes} />
      </Box>
      <Box display="flex" alignItems="center">
        <DatePicker
          views={['year', 'month']}
          label={tt(tokens.common.formFields.month.label)}
          minDate={new Date('2021-03-01')}
          maxDate={new Date('2031-03-01')}
          value={vm.date}
          onChange={(newValue) => {
            vm.date = newValue;
          }}
          renderInput={(params) => <TextField size="small" {...params} helperText={null} />}
        />

        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={async () => {
            await vm.loadFixes();
          }}
          sx={{ ml: 1, mr: 1 }}
          size="medium"
        >
          <TranslatedToken id={tokens.common.refresh} />
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<CloudDownloadIcon />}
          onClick={vm.downloadReport}
          size="medium"
        >
          <TranslatedToken id={tokens.common.download} />
        </Button>
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
