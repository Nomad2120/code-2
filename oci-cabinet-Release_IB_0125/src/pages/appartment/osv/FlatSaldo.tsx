/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from 'react';

import { Autocomplete, Box, Button, Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';
import { darken, lighten } from '@mui/material/styles';

import RefreshIcon from '@mui/icons-material/Refresh';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { getOsvRowsByFlat } from '@shared/utils/helpers/osv';
import { observer } from 'mobx-react-lite';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import { OsvGrid } from '../../../shared/common/OsvGrid';
import notistack from '../../../shared/utils/helpers/notistackExternal';
import flatComparator from '../../../shared/utils/helpers/flatComparator';
import makeFlat from '../../../shared/utils/helpers/makeFlat';

import api from '../../../app/api';

const columns = [
  {
    field: 'period',
    headerName: 'Период',
    minWidth: 160,
    valueGetter: ({ row }: { row: any }) => {
      const { period } = row;
      return period[period.length - 1];
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

export const getUserAbonents = (appartment: any, osiId: number) =>
  appartment.find((e: any) => e.osiId === osiId)?.abonents.map((k: any) => ({ id: k.abonentId, ...k }));

const getBackgroundColor = (color: any, mode: string) => (mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6));

const getHoverBackgroundColor = (color: any, mode: string) =>
  `${mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5)} !important`;

interface Props {
  osi: any;
  userId: number;
}

export const FlatSaldo: React.FC<Props> = observer(({ osi, userId }) => {
  const [loading, setLoading] = useState(false);
  const [abonents, setAbonents] = useState<any[]>([]);
  const [selectedAbonent, setSelectedAbonent] = useState<any | null>(null);
  const [rows, setRows] = useState([]);
  const [totals, setTotals] = useState([]);
  const [periodsNumber, setPeriodsNumber] = useState(0);
  const [isOnlySelfFlat, setIsOnlySelfFlat] = useState(true);

  const fetchAbonents = useCallback(
    async (osiId: number) => {
      setLoading(true);
      try {
        const data = await api.OsiAbonents(osiId);
        // @ts-expect-error api not typed
        setAbonents(data.map((e) => ({ ...e, flat: makeFlat(e) })));
        // @ts-expect-error api not typed
        setSelectedAbonent(data?.length ? data[0] : null);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        notistack.error('Ошибка при получении списка абонентов');
      }
    },
    [setLoading, setAbonents, setSelectedAbonent]
  );

  const fetchUserAppartments = useCallback(
    async (userId: number, osiId: number) => {
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

  const fetchOsv = useCallback(
    async (id: number) => {
      setLoading(true);
      try {
        const data = await api.getOsvOnAllPeriods(id);
        const [rows, total] = getOsvRowsByFlat(data);
        // @ts-expect-error api not typed
        setPeriodsNumber(data.length);
        setRows(rows);
        setTotals(total);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        notistack.error('Ошибка при получении сальдо');
      }
    },
    [setPeriodsNumber, setRows, setTotals, setLoading]
  );

  useEffect(() => {
    if (!osi) return;
    if (isOnlySelfFlat) {
      fetchUserAppartments(userId, osi.id);
    } else {
      fetchAbonents(osi.id);
    }
  }, [osi, userId, isOnlySelfFlat, fetchUserAppartments, fetchAbonents]);

  useEffect(() => {
    if (!selectedAbonent) return;
    fetchOsv(selectedAbonent.id);
  }, [selectedAbonent, fetchOsv]);

  const handleDownload = async (osiId: number, abonentId: number, flat: any) => {
    try {
      setLoading(true);
      const data = await api.getAbonentOSVReport(osiId, abonentId, flat);
      const fetchData = `data:application/xlsx;base64,${data}`;
      const a = document.createElement('a');
      a.href = fetchData;
      a.download = `Оборотно_сальдовая_ведомость_${osi?.name}_по_помещению_${flat}.xlsx`;
      a.click();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      notistack.error('Ошибка при получении отчета');
    }
  };

  const handleChange = (event: any) => {
    setIsOnlySelfFlat(event.target.checked);
  };

  if (!osi || loading) return <LoadingScreen />;

  return (
    <>
      <Box sx={{ mt: 2 }} display="flex" alignItems="center">
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
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
          <Grid item xs={6} sm={2}>
            <FormControlLabel
              control={<Checkbox checked={isOnlySelfFlat} onChange={handleChange} />}
              label="только по своим квартирам"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box display="flex" alignItems="center" sx={{ height: '100%' }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  fetchOsv(selectedAbonent?.id);
                }}
                // sx={{ mx: 2 }}
                size="medium"
                disabled={!selectedAbonent}
              >
                Обновить
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CloudDownloadIcon />}
                onClick={() => handleDownload(osi?.id, selectedAbonent?.id, selectedAbonent?.flat)}
                sx={{ ml: 1 }}
                size="medium"
                disabled={!selectedAbonent}
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
          rows={[...rows]?.map((e, id) => ({ id, ...e }))}
          totals={totals}
          rowCount={periodsNumber}
          getTreeDataPath={(row) => row.period}
        />
      </Box>
    </>
  );
});
