import { observer } from 'mobx-react-lite';
import {
  IOsiAccountApplicationsWidgetViewModel,
  IOsiAccountApplicationsWidgetViewModelToken
} from '@shared/types/mobx/widgets/OsiAccountApplications';
import { useInjection } from 'inversify-react';
import { DataGridPro, GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { Icon } from '@iconify/react';
import { Box, Card, CardContent, CardHeader, Typography, IconButton } from '@mui/material';
import { useTranslation } from '@shared/utils/i18n';
import infoFill from '@iconify-icons/eva/info-fill';
import { AccountApplicationInfoModal } from '@widgets/osi/accountApplications/ui/AccountApplicationInfoModal';
import { useEffect } from 'react';

interface Props {
  onVmInit: (vm: IOsiAccountApplicationsWidgetViewModel) => void;
}

export const AccountApplications: React.FC<Props> = observer(({ onVmInit }) => {
  const vm = useInjection<IOsiAccountApplicationsWidgetViewModel>(IOsiAccountApplicationsWidgetViewModelToken);
  const { getGridLocale: ggl, t } = useTranslation();

  useEffect(() => {
    onVmInit(vm);
  }, [vm]);

  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: '',
      headerAlign: 'center',
      align: 'center',
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          onClick={() => {
            vm.showApplicationInfo(params.row);
          }}
        >
          <Icon icon={infoFill} />
        </IconButton>
      )
    },
    {
      field: 'applicationTypeText',
      headerName: 'Тип заявки',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'stateText',
      headerName: 'Статус',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'account',
      headerName: 'Счет',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'accountTypeNameRu',
      headerName: 'Тип счета',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    }
  ];

  if (!vm.applications.length) return null;

  return (
    <Card sx={{ maxWidth: 1000, minWidth: 800, marginBlockStart: '1rem' }}>
      <CardHeader
        subheader={
          <Box display="flex" alignItems="center">
            <Typography variant="h5" color="textPrimary">
              {t('accountApplications:header')}
            </Typography>
          </Box>
        }
      />
      <CardContent sx={{ height: 200 + 42 + 24 }}>
        <Box sx={{ height: 200 }}>
          <DataGridPro
            rows={vm.applications}
            columns={columns}
            localeText={ggl()}
            hideFooter
            rowHeight={40}
            headerHeight={40}
            loading={false}
            sx={(theme) => ({
              minHeight: '100%',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.mode === 'light' ? '#F4F6F8' : 'rgba(145, 158, 171, 0.16)'
              },
              '& .MuiDataGrid-cell': {
                border: 'none'
              },
              '& .MuiDataGrid-columnHeader': {
                border: 'none'
              }
            })}
          />
        </Box>
        <AccountApplicationInfoModal vm={vm} />
      </CardContent>
    </Card>
  );
});
