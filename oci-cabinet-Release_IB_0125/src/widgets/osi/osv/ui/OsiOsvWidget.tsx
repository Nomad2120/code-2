import { IOsiOsvWidgetViewModel, IOsiOsvWidgetViewModelToken } from '@shared/types/mobx/widgets/OsiOsvWidget';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { darken, lighten } from '@mui/material/styles';
import { useEffect, useMemo } from 'react';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import flatComparator from '@shared/utils/helpers/flatComparator';

import LoadingScreen from '@shared/components/LoadingScreen';
import { Box, Button, Grid, TextField } from '@mui/material';
import { DatePicker } from '@mui/lab';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { OsvGrid } from '@shared/common/OsvGrid';

const getBackgroundColor = (color: any, mode: any) => (mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6));

const getHoverBackgroundColor = (color: any, mode: any) =>
  `${mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5)} !important`;

export const OsiOsvWidget: React.FC = observer(() => {
  const vm = useInjection<IOsiOsvWidgetViewModel>(IOsiOsvWidgetViewModelToken);

  const { translateToken: tt } = useTranslation();

  const columns = useMemo(
    () => [
      {
        field: 'flat',
        headerName: tt(tokens.osiOSV.table.number),
        minWidth: 160,
        valueGetter: ({ row }: { row: any }) => {
          const { flat } = row;
          return flat[flat.length - 1];
        },
        sortComparator: (v1: any, v2: any) => {
          if (v1.length < 6) {
            return flatComparator(v1, v2);
          }
          return true;
        },
        flex: 0.3
      },
      {
        field: 'abonentName',
        headerName: tt(tokens.osiOSV.table.abonentName),
        minWidth: 80,
        flex: 0.3
      },
      {
        field: 'owner',
        headerName: tt(tokens.osiOSV.table.owner),
        minWidth: 80,
        flex: 0.2
      },
      {
        field: 'totalBegin',
        headerName: tt(tokens.osiOSV.table.totalBegin),
        headerAlign: 'left',
        type: 'number',
        align: 'left',
        minWidth: 50,
        flex: 0.2
      },
      {
        field: 'totalDebet',
        headerName: tt(tokens.osiOSV.table.totalDebt),
        headerAlign: 'left',
        type: 'number',
        align: 'left',
        minWidth: 50,
        flex: 0.2
      },
      {
        field: 'totalFixes',
        headerName: tt(tokens.osiOSV.table.totalFixes),
        headerAlign: 'left',
        type: 'number',
        align: 'left',
        minWidth: 50,
        flex: 0.2
      },
      {
        field: 'totalKredit',
        headerName: tt(tokens.osiOSV.table.totalKredit),
        headerAlign: 'left',
        type: 'number',
        align: 'left',
        minWidth: 50,
        flex: 0.2
      },
      {
        field: 'totalFine',
        headerName: tt(tokens.osiOSV.table.totalFine),
        headerAlign: 'left',
        type: 'number',
        align: 'left',
        minWidth: 50,
        flex: 0.2
      },
      {
        field: 'totalEnd',
        headerName: tt(tokens.osiOSV.table.totalEnd),
        headerAlign: 'left',
        type: 'number',
        align: 'left',
        minWidth: 50,
        flex: 0.2
      }
    ],
    [tt]
  );

  useEffect(() => {
    vm.loadOsv();
  }, [vm.startDate, vm.endDate]);

  if (vm.isLoading) return <LoadingScreen />;

  return (
    <>
      <Box display="flex" alignItems="center">
        <Grid container spacing={1}>
          <Grid item xs={6} sm={2}>
            <DatePicker
              views={['year', 'month']}
              label={tt(tokens.common.formFields.month.label)}
              minDate={new Date('2021-03-01')}
              maxDate={new Date('2031-03-01')}
              value={vm.dateFieldValue}
              onChange={(newValue) => {
                vm.dateFieldValue = newValue;
                vm.startDate = newValue;
                vm.endDate = newValue;
              }}
              renderInput={(params) => <TextField size="small" {...params} helperText={null} />}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box display="flex" alignItems="center" sx={{ height: '100%' }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={vm.loadOsv}
                size="medium"
                disabled={vm.startDate > vm.endDate}
              >
                <TranslatedToken id={tokens.common.refresh} />
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CloudDownloadIcon />}
                onClick={vm.downloadOsv}
                sx={{ ml: 1 }}
                size="medium"
                disabled={vm.startDate > vm.endDate}
              >
                <TranslatedToken id={tokens.common.download} />
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          height: '60vh',
          '& .row-child--level-1': {
            bgcolor: (theme) => getBackgroundColor(theme.palette.info.main, theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) => getHoverBackgroundColor(theme.palette.info.main, theme.palette.mode)
            }
          }
        }}
      >
        <OsvGrid
          columns={columns}
          rows={vm.sortedAbonents}
          totals={vm.totalsOsv}
          rowCount={vm.abonentsCount}
          getTreeDataPath={(row) => row?.flat}
        />
      </Box>
    </>
  );
});
