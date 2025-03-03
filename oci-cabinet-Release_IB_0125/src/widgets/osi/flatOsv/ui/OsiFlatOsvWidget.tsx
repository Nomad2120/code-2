import {
  IOsiFlatOsvWidgetViewModel,
  IOsiFlatOsvWidgetViewModelToken
} from '@shared/types/mobx/widgets/OsiFlatOsvWidget';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import LoadingScreen from '@shared/components/LoadingScreen';
import { Autocomplete, Box, Button, Grid, TextField } from '@mui/material';
import flatComparator from '@shared/utils/helpers/flatComparator';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { OsvGrid } from '@shared/common/OsvGrid';
import { darken, lighten } from '@mui/material/styles';
import { useMemo, useEffect } from 'react';
import i18next from 'i18next';

const getBackgroundColor = (color: any, mode: any) => (mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6));

const getHoverBackgroundColor = (color: any, mode: any) =>
  `${mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5)} !important`;

export const OsiFlatOsvWidget: React.FC = observer(() => {
  const vm = useInjection<IOsiFlatOsvWidgetViewModel>(IOsiFlatOsvWidgetViewModelToken);

  const { translateToken: tt } = useTranslation();

  const columns = useMemo(
    () => [
      {
        field: 'period',
        headerName: tt(tokens.osiOSV.table.period),
        minWidth: 160,
        valueGetter: ({ row }: { row: any }) => {
          const { period } = row;
          return period[period.length - 1];
        },
        flex: 0.3
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
    if (!vm.selectedAbonent) return;

    vm.loadOsv();
  }, [vm.selectedAbonent, vm, i18next.language]);

  if (vm.isLoading) return <LoadingScreen />;

  return (
    <>
      <Box sx={{ mt: 2 }} display="flex" alignItems="center">
        <Grid container spacing={1}>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              fullWidth
              disableClearable
              getOptionLabel={(option) => option.flat}
              renderOption={(props, option) => <li {...props}>{option.flat}</li>}
              options={vm.abonents.slice()?.sort((a, b) => flatComparator(a.flat, b.flat))}
              onChange={(event, value) => {
                vm.selectedAbonent = value;
              }}
              // @ts-expect-error autocomplete work with null
              value={vm.selectedAbonent}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={tt(tokens.common.formFields.selectFlat.label)}
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    autoComplete: 'new-password'
                  }}
                  style={{ margin: 0 }}
                />
              )}
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
                disabled={!vm.selectedAbonent}
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
                disabled={!vm.selectedAbonent}
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
          rows={vm.rows?.map((e, id) => ({ id, ...e }))}
          totals={vm.totalsOsv}
          rowCount={vm.periodsNumber}
          getTreeDataPath={(row) => row.period}
        />
      </Box>
    </>
  );
});
