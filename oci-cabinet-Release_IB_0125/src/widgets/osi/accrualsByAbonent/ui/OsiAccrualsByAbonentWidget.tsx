import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import {
  IOsiAccrualsByAbonentViewModel,
  IOsiAccrualsByAbonentViewModelToken
} from '@shared/types/mobx/widgets/OsiAccrualsByAbonentWidget';
import { useEffect, useMemo } from 'react';
import moment from 'moment/moment';
import { tokens, useTranslation } from '@shared/utils/i18n';
import LoadingScreen from '@shared/components/LoadingScreen';
import { Autocomplete, Box, Grid, TextField } from '@mui/material';
import flatComparator from '@shared/utils/helpers/flatComparator';
import { DatePicker } from '@mui/lab';
import AccrualsTable from '@shared/common/AccrualsTable';
import { darken, lighten } from '@mui/material/styles';

const getBackgroundColor = (color: any, mode: any) => (mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6));

const getHoverBackgroundColor = (color: any, mode: any) =>
  `${mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5)} !important`;

export const OsiAccrualsByAbonentWidget: React.FC = observer(() => {
  const vm = useInjection<IOsiAccrualsByAbonentViewModel>(IOsiAccrualsByAbonentViewModelToken);

  const { translateToken: tt, t } = useTranslation();

  const columns = useMemo(
    () => [
      { field: 'id', hide: true },
      { field: 'level', hide: true },
      {
        field: 'service',
        headerName: t('osv:tableByAbonent.service'),
        minWidth: 160,
        valueGetter: ({ row }: { row: any }) => {
          const { groupName } = row;
          return groupName[groupName.length - 1];
        },
        flex: 0.3
      },
      {
        field: 'totalAccrual',
        headerName: t('osv:tableByAbonent.totalDebt'),
        headerAlign: 'left',
        type: 'number',
        align: 'left',
        minWidth: 50,
        valueGetter: (params: any) => (typeof params.value === 'number' ? params.value.toFixed(2) : params.value),
        flex: 0.2
      },
      {
        field: 'totalFix',
        headerName: t('osv:tableByAbonent.totalFixes'),
        headerAlign: 'left',
        type: 'number',
        align: 'left',
        minWidth: 50,
        valueGetter: (params: any) => (typeof params.value === 'number' ? params.value.toFixed(2) : params.value),
        flex: 0.2
      },
      {
        field: 'totalTotal',
        headerName: t('osv:tableByAbonent.total'),
        headerAlign: 'left',
        type: 'number',
        align: 'left',
        minWidth: 50,
        valueGetter: (params: any) => (typeof params.value === 'number' ? params.value.toFixed(2) : params.value),
        flex: 0.2
      }
    ],
    [tt]
  );

  useEffect(() => {
    vm.loadAbonents();
  }, []);

  useEffect(() => {
    if (!vm.selectedAbonent) return;
    vm.loadAccruals();
  }, [vm.selectedAbonent, vm.startDate, vm.endDate]);

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
              options={vm.abonents?.slice()?.sort((a, b) => flatComparator(a.flat, b.flat))}
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
          <Grid item xs={12} sm={3}>
            <DatePicker
              views={['year', 'month']}
              label={tt(tokens.common.formFields.month.label)}
              minDate={new Date('2021-03-01')}
              maxDate={new Date('2031-03-01')}
              value={vm.dateValue}
              onChange={(newValue) => {
                vm.dateValue = newValue;
                vm.startDate = moment(newValue).startOf('month').toDate();
                vm.endDate = moment(newValue).endOf('month').toDate();
              }}
              renderInput={(params) => <TextField size="small" {...params} helperText={null} />}
            />
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
        <AccrualsTable rows={vm.rows} columns={columns} />
      </Box>
    </>
  );
});
