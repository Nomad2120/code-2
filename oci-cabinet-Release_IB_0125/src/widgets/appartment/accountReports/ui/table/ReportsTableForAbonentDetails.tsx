import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import logger from 'js-logger';
import { Box, Button } from '@mui/material';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { AppartmentReportsViewModel } from '@widgets/appartment/accountReports/model';

interface Props {
  detailData: any;
}

export const ReportsTableForAbonentDetails: React.FC<Props> = observer(({ detailData }) => {
  const appartmentReportsViewModel = useInjection(AppartmentReportsViewModel);

  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: '',
      width: 150,
      align: 'center',
      renderCell: (params) => {
        const list = params.row;
        logger.info('accounts params', params);

        const clickHandler = () => {
          // appartmentReportsViewModel.showListDetails(list);
          appartmentReportsViewModel.showReportListByReportId(detailData?.id);
        };

        return (
          <Box>
            <Button variant={'outlined'} size={'small'} onClick={clickHandler}>
              Просмотреть
            </Button>
          </Box>
        );
      }
    },
    { field: 'account', headerName: 'Номер счета', flex: 1, align: 'center', headerAlign: 'center' },
    {
      field: 'accountTypeNameRu',
      headerName: 'Тип счета',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    }
  ];

  const rows = detailData.lists ?? [];

  return (
    <Box sx={{ height: '100%' }}>
      <DataGridPro columns={columns} rows={rows} rowHeight={40} headerHeight={40} hideFooter />
    </Box>
  );
});
