import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { AppartmentReportsViewModel } from '@widgets/appartment/accountReports/model';
import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { DataGridPro, GridColDef, GridValueFormatterParams } from '@mui/x-data-grid-pro';
import React from 'react';
import moment from 'moment';
import { ReportsItemDetails } from '@widgets/appartment/accountReports/ui/table/ReportsItemDetails';
import { OperationTypes } from '@shared/types/osi/accountReports';
import LoadingScreen from '@/shared/components/LoadingScreenFullScreen';

export const ReportsViewerForAbonent: React.FC = observer(() => {
  const appartmentReportsViewModel = useInjection(AppartmentReportsViewModel);

  const { viewer, period, filledItemsIds, getCategoryById } = appartmentReportsViewModel;
  const { isOpen, selectedAccount, isLoading } = viewer;

  const closeHandler = (e: any, reason: any) => {
    if (reason === 'backdropClick') return;

    appartmentReportsViewModel.closeViewer();
  };

  const getDetailPanel = ({ row }: any) => <ReportsItemDetails itemDetails={row} />;

  const columns: GridColDef[] = [
    {
      field: 'dt',
      headerName: 'Дата операции',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      maxWidth: 150,
      valueFormatter: (params) => {
        if (params.value === null) {
          return '';
        }

        return moment(params.value).format('DD.MM.YYYY');
      }
    },
    { field: 'amount', headerName: 'Сумма', align: 'center', headerAlign: 'center', flex: 1, maxWidth: 250 },
    {
      field: 'categoryId',
      headerName: 'Категория',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      maxWidth: 250,
      valueFormatter: (params: GridValueFormatterParams) => getCategoryById(params.value)
    },
    {
      field: 'assign',
      headerName: 'Назначение',
      align: 'center',
      headerAlign: 'center',
      flex: 1
    },
    {
      field: 'operationType',
      headerName: 'Тип операции',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      maxWidth: 150,
      valueFormatter: (params: GridValueFormatterParams<OperationTypes>) => {
        if (params.value === 'DEBET') return 'Расход';
        return 'Приход';
      }
    }
  ];

  const rows = selectedAccount?.items ?? [];

  return (
    <Dialog open={isOpen} onClose={closeHandler} maxWidth={false} fullWidth className={'account-reports'}>
      {!isLoading ? (
        <>
          <DialogContent>
            <Box>
              <Typography>{`Текущий счет: ${selectedAccount?.account}`}</Typography>
              <Typography>{`Период выписки: ${period}`}</Typography>
              <Typography>{`Входящий остаток: ${selectedAccount?.begin}`}</Typography>
              <Typography>{`Исходящий остаток: ${selectedAccount?.end}`}</Typography>
              <DataGridPro
                sx={{
                  '& .MuiDataGrid-cell[data-field="__detail_panel_toggle__"] button': {
                    display: 'none'
                  }
                }}
                hideFooter
                columns={columns}
                rows={rows}
                rowHeight={40}
                headerHeight={40}
                getDetailPanelHeight={() => 'auto'}
                getDetailPanelContent={getDetailPanel}
                components={{
                  DetailPanelExpandIcon: ExpandIcon,
                  DetailPanelCollapseIcon: CollapseIcon
                }}
                initialState={{
                  detailPanel: { expandedRowIds: filledItemsIds }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant={'outlined'} onClick={closeHandler as any}>
              Закрыть
            </Button>
          </DialogActions>
        </>
      ) : (
        <Box className={'w-full h-[80vh]'}>
          <LoadingScreen />
        </Box>
      )}
    </Dialog>
  );
});

// const ExpandIcon: React.FC = () => <AddCircleOutlineIcon sx={(theme) => ({ color: theme.palette.primary.main })} />;
const ExpandIcon: React.FC = () => null;

// const CollapseIcon: React.FC = () => (
//   <RemoveCircleOutlineIcon sx={(theme) => ({ color: theme.palette.primary.main })} />
// );

const CollapseIcon: React.FC = () => null;
