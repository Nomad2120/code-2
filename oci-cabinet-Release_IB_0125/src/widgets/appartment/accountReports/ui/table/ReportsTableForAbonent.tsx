import { observer } from 'mobx-react-lite';
import { DataGridPro, GridColDef, useGridApiRef } from '@mui/x-data-grid-pro';
import React from 'react';
import moment from 'moment/moment';
import { useInjection } from 'inversify-react';
import { AppartmentReportsViewModel } from '@widgets/appartment/accountReports/model';
import { ReportsTableForAbonentDetails } from '@widgets/appartment/accountReports/ui/table/ReportsTableForAbonentDetails';
import { Button } from '@mui/material';

export const ReportsTableForAbonent: React.FC = observer(() => {
  const appartmentReportsViewModel = useInjection(AppartmentReportsViewModel);
  const apiRef = useGridApiRef();
  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: '',
      renderCell: (params) => {
        const { isReportHasDocs } = appartmentReportsViewModel;
        const clickHandler = () => {
          void appartmentReportsViewModel.showReportListByReportId(params.row.id);
        };

        return (
          <Button disabled={!isReportHasDocs(params.row.id)} variant={'outlined'} size={'small'} onClick={clickHandler}>
            Просмотреть
          </Button>
        );
      },
      width: 150
    },
    {
      field: 'period',
      headerName: 'Период',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      maxWidth: 220,
      valueFormatter: (params) => {
        if (!params.value) return '';

        const period = `${moment(params.value).format('DD.MM.YYYY')} - ${moment(params.value)
          .endOf('month')
          .format('DD.MM.YYYY')}`;

        return period;
      }
    },
    {
      field: 'reportName',
      headerName: 'Название отчета',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'publishDate',
      headerName: 'Опубликован',
      flex: 1,
      maxWidth: 220,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (params) => {
        if (params.value === null) {
          return '';
        }

        return moment(params.value).format('DD.MM.YYYY');
      }
    }
  ];

  const rows = appartmentReportsViewModel.reports.map((report) => {
    const item = { ...report, reportName: 'Отчет перед жильцами' };
    return item;
  });

  const getDetailPanel = ({ row }: any) => <ReportsTableForAbonentDetails detailData={row} />;

  return (
    <DataGridPro
      apiRef={apiRef}
      rows={rows}
      columns={columns}
      rowHeight={40}
      headerHeight={40}
      // getDetailPanelHeight={() => 'auto'}
      // getDetailPanelContent={getDetailPanel}
      // initialState={{
      //   detailPanel: { expandedRowIds: [rows[0]?.id] }
      // }}
      hideFooter
    />
  );
});
