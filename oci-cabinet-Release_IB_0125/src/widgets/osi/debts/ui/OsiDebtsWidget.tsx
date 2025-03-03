import { IOsiDebtsWidgetViewModel, IOsiDebtsWidgetViewModelToken } from '@shared/types/mobx/widgets/OsiDebtsWidget';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { DataGridPro, GridColDef, GridValueGetterParams, useGridApiRef } from '@mui/x-data-grid-pro';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { useMemo } from 'react';
import GridTreeDataGroupingCell from '@shared/common/OsvGrid/GridTreeDataGroupingCell';
import { Box, LinearProgress } from '@mui/material';
import { CreateDebtButton } from '@features/osi/debts/createDebt';

const groupCol: Partial<GridColDef> = {
  headerName: '',
  valueGetter: (params) => {
    if (params.row.level === 0) return params.row.abonent;
    if (params.row.level === 1) return params.row.serviceGroup;
    return params.row;
  },
  // @ts-expect-error jsx not typed
  renderCell: (params) => <GridTreeDataGroupingCell {...params} margin={1} />,
  align: 'left',
  width: 60
};

export const OsiDebtsWidget: React.FC = observer(() => {
  const vm = useInjection<IOsiDebtsWidgetViewModel>(IOsiDebtsWidgetViewModelToken);
  const apiRef = useGridApiRef();

  const { translateToken: tt, getGridLocale } = useTranslation();

  const columns = useMemo(
    () => [
      {
        field: 'flat',
        flex: 0.5,
        headerName: tt(tokens.osiDebts.table.number)
      },
      {
        field: 'abonentName',
        flex: 1,
        headerName: tt(tokens.osiDebts.table.abonent)
      },
      {
        field: 'serviceGroupNameRu',
        flex: 1,
        headerName: tt(tokens.osiDebts.table.serviceGroup)
      },
      {
        field: 'amount',
        flex: 0.5,
        headerName: tt(tokens.osiDebts.table.amount),
        valueGetter: (params: GridValueGetterParams) => {
          if (params.row?.totalAmount) return params.row.totalAmount;
          return params.row.amount;
        }
      },
      {
        field: 'period',
        flex: 0.5,
        headerName: tt(tokens.osiDebts.table.period),
        type: 'date',
        valueGetter: (params: GridValueGetterParams) =>
          params.value
            ? new Date(params.value).toLocaleString('ru-RU', {
                year: 'numeric',
                month: 'long'
              })
            : ''
      }
    ],
    [tt]
  );

  return (
    <>
      <CreateDebtButton refreshCb={vm.refreshDebts} />
      <Box sx={{ height: '55vh', width: '100%' }}>
        <DataGridPro
          components={{
            LoadingOverlay: LinearProgress
          }}
          loading={vm.isLoading}
          localeText={getGridLocale()}
          rows={vm.debts}
          columns={columns}
          apiRef={apiRef}
          disableSelectionOnClick
          disableColumnMenu
          sx={{ width: 1080 }}
          treeData
          getTreeDataPath={(row) => row.path}
          groupingColDef={groupCol}
          density="compact"
        />
      </Box>
    </>
  );
});
