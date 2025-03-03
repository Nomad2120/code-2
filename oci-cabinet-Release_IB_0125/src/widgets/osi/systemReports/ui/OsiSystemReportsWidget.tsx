import { observer } from 'mobx-react-lite';
import { useTranslation } from '@shared/utils/i18n';
import { Box, LinearProgress } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import {
  IOsiSystemReportsWidgetVmToken,
  IOsiSystemReportsWidgetViewModel
} from '@shared/types/mobx/widgets/OsiSystemReports';
import { useInjection } from 'inversify-react';
import { Trans } from 'react-i18next';
import { LoadingButton } from '@mui/lab';
import { darken, lighten } from '@mui/material/styles';

const tMainPrefix = 'systemReports';

const getBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getHoverBackgroundColor = (color: string, mode: string) =>
  `${mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5)} !important`;

export const OsiSystemReportsWidget: React.FC = observer(() => {
  const vm = useInjection<IOsiSystemReportsWidgetViewModel>(IOsiSystemReportsWidgetVmToken);
  const { getGridLocale, t } = useTranslation();

  const columns: GridColDef[] = [
    {
      field: 'action',
      headerName: '',
      minWidth: 180,
      align: 'center',

      renderCell: (params) => (
        <LoadingButton
          loading={vm.isLoading}
          variant="outlined"
          color="primary"
          startIcon={<CloudDownloadIcon />}
          onClick={() => vm.onDownloadReportClick(params.row)}
          sx={{ m: 1 }}
          size={'medium'}
        >
          <Trans t={t} i18nKey={'common:download'} />
        </LoadingButton>
      )
    },
    {
      field: 'name',
      headerName: t(`${tMainPrefix}:debts.table.name`),
      valueFormatter: (params) => t(params.value),
      minWidth: 100,
      flex: 0.3,
      headerAlign: 'center'
    },
    {
      field: 'comment',
      headerName: t(`${tMainPrefix}:debts.table.comment`),
      valueFormatter: (params) => t(params.value),
      minWidth: 200,
      flex: 0.6,
      headerAlign: 'center'
    }
  ];

  return (
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
      <DataGridPro
        sx={{
          '& .MuiDataGrid-row': {
            '&.Mui-selected': {
              backgroundColor: 'unset',
              '&:hover': {
                backgroundColor: 'unset'
              }
            },
            '&:hover': {
              backgroundColor: 'unset'
            }
          },
          '& .MuiDataGrid-cell': {
            '&:focus-within': {
              outline: 'none !important'
            }
          }
        }}
        loading={vm.isLoading}
        components={{
          LoadingOverlay: LinearProgress
        }}
        localeText={getGridLocale()}
        getRowHeight={() => 'auto'}
        getRowClassName={(params) => `row-child--level-${params.getValue(params.id, 'level')}`}
        rows={vm.reports}
        columns={columns}
        density="compact"
        disableSelectionOnClick
        hideFooter
      />
    </Box>
  );
});
