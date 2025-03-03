import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { sumBy } from 'lodash';

import { Autocomplete, Box, Grid, TextField } from '@mui/material';
import { darken, lighten } from '@mui/material/styles';

import { DatePicker } from '@mui/lab';
import { Any } from 'react-spring';
import { observer } from 'mobx-react-lite';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import notistack from '../../../shared/utils/helpers/notistackExternal';
import flatComparator from '../../../shared/utils/helpers/flatComparator';
import api from '../../../app/api';
import AccrualsTable from '../../../shared/common/AccrualsTable';
import { getUserAbonents } from './FlatSaldo';

const columns = [
  { field: 'id', hide: true },
  { field: 'level', hide: true },
  {
    field: 'groupName',
    headerName: 'Услуга',
    minWidth: 160,
    valueGetter: ({ row }: { row: any }) => {
      const { groupName } = row;
      return groupName[groupName.length - 1];
    },
    flex: 0.3
  },
  {
    field: 'totalAccrual',
    headerName: 'Начисленно, тг.',
    headerAlign: 'left',
    type: 'number',
    align: 'left',
    minWidth: 50,
    valueGetter: (params: any) => (typeof params.value === 'number' ? params.value.toFixed(2) : params.value),
    flex: 0.2
  },
  {
    field: 'totalFix',
    headerName: 'Корректировка, тг.',
    headerAlign: 'left',
    type: 'number',
    align: 'left',
    minWidth: 50,
    valueGetter: (params: any) => (typeof params.value === 'number' ? params.value.toFixed(2) : params.value),
    flex: 0.2
  },
  {
    field: 'totalTotal',
    headerName: 'Общая сумма, тг.',
    headerAlign: 'left',
    type: 'number',
    align: 'left',
    minWidth: 50,
    valueGetter: (params: any) => (typeof params.value === 'number' ? params.value.toFixed(2) : params.value),
    flex: 0.2
  }
];

function getRows(abonents: any) {
  return abonents.reduce(
    (acc: any, item: any) => [
      ...acc,
      {
        id: item.groupName,
        level: 0,
        groupName: [item.groupName],
        totalAccrual: sumBy(item.services, 'accural'),
        totalFix: sumBy(item.services, 'fix'),
        totalTotal: sumBy(item.services, 'total')
      },
      ...item.services.map((e: any) => ({
        id: item.groupName + e.serviceName,
        level: 1,
        groupName: [item.groupName, e.serviceName],
        totalAccrual: e.accural,
        totalFix: e.fix,
        totalTotal: e.total
      }))
    ],
    []
  );
}

const getBackgroundColor = (color: any, mode: string) => (mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6));

const getHoverBackgroundColor = (color: any, mode: string) =>
  `${mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5)} !important`;

interface Props {
  osi: any;
  userId: number;
}

export const AccrualsByAbonent: React.FC<Props> = observer(({ osi, userId }) => {
  const [loading, setLoading] = useState(false);
  const [abonents, setAbonents] = useState<any[]>([]);
  const [selectedAbonent, setSelectedAbonent] = useState<any | null>(null);
  const [rows, setRows] = useState([]);
  const [value, setValue] = useState<Date | any>(moment().add(-1, 'month'));
  const [startDate, setStartDate] = useState(moment(value).startOf('month').toDate());
  const [endDate, setEndDate] = useState(moment(value).endOf('month').toDate());

  const fetchAccruals = useCallback(
    async (abonentId, startDate, endDate) => {
      setLoading(true);
      try {
        const data = await api.getAccrualsByAbonent(
          abonentId,
          moment.utc(startDate).local().format('YYYY-MM-DD'),
          moment.utc(endDate).local().format('YYYY-MM-DD')
        );
        setRows(getRows(data));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        notistack.error('Ошибка при получении начислений');
      }
    },
    [setRows, setLoading]
  );

  const fetchUserAppartments = useCallback(
    async (userId, osiId) => {
      try {
        const data = await api.UsersAppartments(userId);
        const userAbonents = getUserAbonents(data, osiId);
        setAbonents(userAbonents);
        setSelectedAbonent(userAbonents?.length ? userAbonents[0] : null);
      } catch (error) {
        console.error(error);
        notistack.error('Ошибка при получении отчета');
      }
    },
    [setAbonents, setSelectedAbonent]
  );

  useEffect(() => {
    if (!osi) return;
    fetchUserAppartments(userId, osi.id);
  }, [osi, userId, fetchUserAppartments]);

  useEffect(() => {
    if (!selectedAbonent) return;
    // fetchAccruals(727, '2021-09-01', '2021-09-30');
    fetchAccruals(selectedAbonent.id, startDate, endDate);
  }, [selectedAbonent, startDate, endDate, fetchAccruals]);

  if (!osi || loading) return <LoadingScreen />;

  return (
    <>
      <Box sx={{ mt: 2 }} display="flex" alignItems="center">
        <Grid container spacing={1}>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              fullWidth
              disableClearable
              getOptionLabel={(option) => option.flat}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => <li {...props}>{option.flat}</li>}
              options={abonents?.sort((a, b) => flatComparator(a.flat, b.flat))}
              onChange={(event, value) => {
                setSelectedAbonent(value);
              }}
              value={selectedAbonent}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Выбор помещения"
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
              label="Месяц"
              minDate={new Date('2021-03-01')}
              maxDate={new Date('2031-03-01')}
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
                setStartDate(moment(newValue).startOf('month').toDate());
                setEndDate(moment(newValue).endOf('month').toDate());
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
        <AccrualsTable rows={rows} columns={columns} />
      </Box>
    </>
  );
});
