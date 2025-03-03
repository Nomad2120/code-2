import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import { Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import { darken, lighten } from '@mui/material/styles';

import { DatePicker } from '@mui/lab';

import RefreshIcon from '@mui/icons-material/Refresh';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { getOsvRows } from '@shared/utils/helpers/osv';
import { observer } from 'mobx-react-lite';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import { OsvGrid } from '../../../shared/common/OsvGrid';
import notistack from '../../../shared/utils/helpers/notistackExternal';
import flatComparator from '../../../shared/utils/helpers/flatComparator';

import api from '../../../app/api';

const columns = [
  {
    field: 'flat',
    headerName: '№ помещения',
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
    field: 'totalBegin',
    headerName: 'Сальдо на начало',
    headerAlign: 'left',
    type: 'number',
    align: 'left',
    minWidth: 50,
    flex: 0.2
  },
  {
    field: 'totalDebet',
    headerName: 'Начисленно',
    headerAlign: 'left',
    type: 'number',
    align: 'left',
    minWidth: 50,
    flex: 0.2
  },
  {
    field: 'totalFixes',
    headerName: 'Корректировки',
    headerAlign: 'left',
    type: 'number',
    align: 'left',
    minWidth: 50,
    flex: 0.2
  },
  {
    field: 'totalKredit',
    headerName: 'Оплачено',
    headerAlign: 'left',
    type: 'number',
    align: 'left',
    minWidth: 50,
    flex: 0.2
  },
  {
    field: 'totalEnd',
    headerName: 'Долг',
    headerAlign: 'left',
    type: 'number',
    align: 'left',
    minWidth: 50,
    flex: 0.2
  }
];

const getBackgroundColor = (color: any, mode: string) => (mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6));

const getHoverBackgroundColor = (color: any, mode: string) =>
  `${mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5)} !important`;

interface Props {
  osi: any;
  userId: number;
}

export const OsiSaldo: React.FC<Props> = observer(({ osi, userId }) => {
  const [value, setValue] = useState<Date | null>(new Date());
  const [startDate, setStartDate] = useState(moment(value).startOf('month').toDate());
  const [endDate, setEndDate] = useState(moment(value).endOf('month').toDate());
  const [loading, setLoading] = useState(false);
  const [selectedOsi, setSelectedOsi] = useState({ ...osi });
  const [userOsis, setUserOsis] = useState([osi]);
  const [rows, setRows] = useState([]);
  const [totals, setTotals] = useState([]);
  const [abonentsNumber, setAbonentsNumber] = useState(0);

  const fetchOsv = useCallback(
    async (id) => {
      setLoading(true);
      try {
        // @ts-expect-error api not typed
        const { abonents } = await api.getOsvByPeriod(
          id,
          moment.utc(startDate).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
          moment.utc(endDate).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]')
        );

        const [rows, total] = getOsvRows(abonents);

        setAbonentsNumber(abonents?.length);
        setRows(rows);
        setTotals(total);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
        notistack.error('Ошибка при получении сальдо');
      } finally {
        setLoading(false);
      }
    },
    [startDate, endDate, setAbonentsNumber, setRows, setTotals, setLoading]
  );

  const fetchUserOsis = useCallback(
    async (id) => {
      try {
        const data = await api.UsersAppartments(id);
        // @ts-expect-error api not typed
        setUserOsis(data?.map((e: any) => ({ id: e.osiId, name: e.osiName })));
      } catch (error) {
        console.error(error);
        notistack.error('Ошибка при получении отчета');
      }
    },
    [setUserOsis]
  );

  useEffect(() => {
    if (!userId) return;
    fetchUserOsis(userId);
  }, [userId, fetchUserOsis]);

  useEffect(() => {
    if (!selectedOsi) return;
    fetchOsv(selectedOsi.id);
  }, [selectedOsi, fetchOsv]);

  const handleOsiChange = (event: any) => {
    const osi = userOsis.find((e) => e.id === event.target.value);
    setSelectedOsi({ ...osi });
  };

  const handleDownload = async (osiId: number, osiName: any) => {
    setLoading(true);
    const db = moment.utc(startDate).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]');
    const de = moment.utc(endDate).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]');
    try {
      const data = await api.getOSVReport(osiId, db, de, true);
      const fetchData = `data:application/xlsx;base64,${data}`;
      const a = document.createElement('a');
      a.href = fetchData;
      a.download = `Оборотно_сальдовая_ведомость_${osiName}_${db.substring(0, 10)}_${de.substring(0, 10)}.xlsx`;
      a.click();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      notistack.error('Ошибка при получении отчета');
    }
  };

  if (!osi || loading) return <LoadingScreen />;

  return (
    <>
      <Box sx={{ mt: 2 }} display="flex" alignItems="center">
        <Grid container spacing={1}>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              defaultValue="Выбор ОСИ"
              size="small"
              value={selectedOsi.id}
              label="Выбор ОСИ"
              onChange={handleOsiChange}
            >
              {userOsis.map((osi, i) => (
                <MenuItem key={i} value={osi.id}>
                  {osi.name}
                </MenuItem>
              ))}
            </TextField>
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
          <Grid item xs={12} sm={4}>
            <Box display="flex" alignItems="center" sx={{ height: '100%' }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  fetchOsv(selectedOsi.id);
                }}
                size="medium"
                disabled={startDate > endDate}
              >
                Обновить
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CloudDownloadIcon />}
                onClick={() => handleDownload(selectedOsi.id, selectedOsi.name)}
                sx={{ ml: 1 }}
                size="medium"
                disabled={startDate > endDate}
              >
                Скачать
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
          // @ts-expect-error not typed
          rows={[...rows]?.map((e, id) => ({ id, ...e })).sort((a, b) => flatComparator(a.flat[0], b.flat[0]))}
          totals={totals}
          rowCount={abonentsNumber}
          getTreeDataPath={(row) => row.flat}
        />
      </Box>
    </>
  );
});
