import React from 'react';
import { useInjection } from 'inversify-react';
import { AllAccountReportsViewModel } from '@widgets/osi/accountReports/allAccountReports/model/viewModel';
import { observer } from 'mobx-react-lite';
import { DataGridPro, GridColDef, useGridApiRef } from '@mui/x-data-grid-pro';
import { Box, Button, IconButton } from '@mui/material';
import moment from 'moment';
import { AccountReport } from '@shared/types/osi/accountReports';
import InfoIcon from '@mui/icons-material/Info';
import { AcceptDialog } from '@widgets/osi/accountReports/allAccountReports/ui/AcceptDialog';
import { useTranslation } from '@shared/utils/i18n';
import { MonthlyDebtModal } from '@pages/osi/reports/MonthlyDebtModal';

const instructionLink = 'https://www.youtube.com/watch?v=RFIgTdEQ4A0';

export const ReportsTable: React.FC = observer(() => {
  const apiRef = useGridApiRef();
  const viewModel = useInjection(AllAccountReportsViewModel);
  const { getGridLocale: ggl, t } = useTranslation();

  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: '',
      renderCell: (params) => {
        const { row } = params;

        const clickHandler = () => {
          if (row.state !== 'PUBLISHED') {
            viewModel.onPublishClick(row);
            return;
          }

          void viewModel.showReportListByReportId(params.row.id);
        };

        return (
          <Button variant={'outlined'} size={'small'} onClick={clickHandler}>
            {row.state === 'PUBLISHED' ? t('accountReports:view') : t('accountReports:publish')}
          </Button>
        );
      },
      width: 150
    },
    {
      field: 'period',
      headerName: `${t('accountReports:period')}`,
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
      headerName: `${t('accountReports:reportName')}`,
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'publishDate',
      headerName: `${t('accountReports:published')}`,
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

  const rows = viewModel.allReports?.map((report) => {
    const item = { ...report, reportName: t('accountReports:report') };
    return item;
  });

  const getDetailPanel = ({ row }: { row: AccountReport }) => {
    if (row.state === 'PUBLISHED') return null;

    const columns: GridColDef[] = [
      {
        field: 'actions',
        headerName: '',
        width: 150,
        align: 'center',
        renderCell: (params) => {
          const list = params.row;

          const clickHandler = () => {
            if (row.state === 'PUBLISHED') {
              void viewModel.showReportListByReportId(row.id);
              return;
            }

            viewModel.onEditListClick(list);
          };

          const infoHandler = () => {
            window.open(instructionLink, '_blank');
          };

          const getButtonLabel = () => {
            if (row.state === 'PUBLISHED') {
              return t('accountReports:view');
            }

            if (list.isFilled) {
              return t('common:edit');
            }

            return t('common:fill');
          };

          return (
            <Box>
              <Button variant={'outlined'} size={'small'} onClick={clickHandler}>
                {getButtonLabel()}
              </Button>
              {!list.isFilled && row.state !== 'PUBLISHED' && (
                <IconButton sx={{ ml: 0.5 }} size={'small'} color={'primary'} onClick={infoHandler}>
                  <InfoIcon />
                </IconButton>
              )}
            </Box>
          );
        }
      },
      {
        field: 'account',
        headerName: t('accountReports:account.number'),
        flex: 1,
        align: 'center',
        headerAlign: 'center'
      },
      {
        field: 'accountTypeNameRu',
        headerName: t('accountReports:account.type'),
        flex: 1,
        align: 'center',
        headerAlign: 'center'
      }
    ];

    const rows = row.lists ?? [];

    return (
      <Box sx={{ height: '100%' }}>
        <DataGridPro columns={columns} rows={rows} rowHeight={40} headerHeight={40} />
      </Box>
    );
  };

  return (
    <>
      <DataGridPro
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        rowHeight={40}
        headerHeight={40}
        getDetailPanelHeight={() => 'auto'}
        getDetailPanelContent={getDetailPanel}
        initialState={{
          detailPanel: { expandedRowIds: [rows[0]?.id] }
        }}
        localeText={ggl()}
      />
      <AcceptDialog
        isOpen={viewModel.isOpenAcceptDialogOpen}
        onCancel={viewModel.cancelPublishReport}
        onAccept={viewModel.publishReport}
      />
      <MonthlyDebtModal
        isOpen={viewModel.dialog.freeMode.isOpen}
        onClose={() => {
          viewModel.dialog.freeMode.isOpen = false;
        }}
        onPublishClicked={viewModel.publishReportInFreeMode}
      />
    </>
  );
});
