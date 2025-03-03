import { observer } from 'mobx-react-lite';
import { DataGridPro, GridCellEditCommitParams, GridCellParams, GridColDef, useGridApiRef } from '@mui/x-data-grid-pro';
import { useCallback, useState } from 'react';
import { useTranslation } from '@shared/utils/i18n';
import flatComparator from '@shared/utils/helpers/flatComparator';
import api from '@app/api';
import { round } from 'lodash';
import notistack from '@shared/utils/helpers/notistackExternal';
import { Box, Typography } from '@mui/material';
import {
  IOsiServiceSaldoTableViewModel,
  IOsiServiceSaldoTableVmToken
} from '@shared/types/mobx/entities/osiServiceSaldo';
import { useInjection } from 'inversify-react';
import { ServiceGroupSaldoResponseItem } from '@shared/types/osi/saldoByGroups';

interface Props {
  rows: ServiceGroupSaldoResponseItem[] | null | undefined;
}

export const ServiceSaldoTable: React.FC<Props> = observer(({ rows }) => {
  const vm = useInjection<IOsiServiceSaldoTableViewModel>(IOsiServiceSaldoTableVmToken);
  const apiRef = useGridApiRef();
  const [list, setList] = useState(() => (rows?.length ? rows : []));
  const { getGridLocale, t } = useTranslation();

  const columns: GridColDef[] = [
    {
      field: 'flat',
      headerName: t('osv:table.flatNumber'),
      align: 'left',
      flex: 0.33,
      editable: false,
      sortComparator: (v1, v2) => flatComparator(v1, v2)
    },
    {
      field: 'abonentName',
      headerName: t('osv:table.owner'),
      align: 'left',
      flex: 0.33,
      editable: false
    },
    {
      field: 'saldo',
      headerName: t('osv:table.saldo'),
      type: 'number',
      align: 'right',
      flex: 0.33,
      editable: true,
      cellClassName: 'saldo--cell'
    }
  ];

  const handleCellEditCommit = useCallback(
    async ({ id, field, value }: GridCellEditCommitParams) => {
      if (field === 'saldo') {
        if (value === null) {
          value = '0';
        }
        try {
          const row = list.find((e) => e.id === id);

          if (!row) throw new Error('Ошибка при изменении сальдо');

          const edited = row.saldo !== parseFloat(value);

          if (edited) {
            await api.ServiceGroupSaldoUpdate(row.id, JSON.stringify(value));

            const updatedRows = list.map((row) => {
              if (row.id === id) {
                return {
                  ...row,
                  saldo: round(value, 2)
                };
              }
              return row;
            });
            setList(updatedRows);
            notistack.success('Сохранено');
          } else {
            if (value !== '0') return;

            const updatedRows = list.map((row) => {
              if (row.id === id) {
                return {
                  ...row,
                  saldo: round(0, 2)
                };
              }
              return row;
            });
            setList(updatedRows);
          }
        } catch (err) {
          if (err instanceof Error) {
            notistack.error(err.toString());
            return;
          }

          notistack.error('Ошибка');
        }
      }
    },
    [list]
  );

  const handleCellEditStart = (params: GridCellParams) => {
    const { id, field, value } = params;

    const newValue = !value ? '' : value;
    apiRef.current.setEditCellValue({ id, field, value: newValue, debounceMs: 100 });
  };

  if (!Array.isArray(rows) || !rows.length) {
    return <Typography>Отсутвуют</Typography>;
  }

  return (
    <Box
      sx={{
        '& .saldo--cell': {
          color: '#38aa52',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(23,28,36, 0.55)' : 'rgba(239,248,242, 0.55)',
          fontWeight: '800'
        }
      }}
    >
      <DataGridPro
        apiRef={apiRef}
        localeText={getGridLocale()}
        rows={[...list].sort((a, b) => flatComparator(a.flat, b.flat))}
        columns={columns}
        density="compact"
        disableSelectionOnClick
        onCellEditCommit={handleCellEditCommit}
        onCellEditStart={handleCellEditStart}
        hideFooter
      />
    </Box>
  );
});
