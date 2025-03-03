import { observer } from 'mobx-react-lite';
import { DataGridPro, GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { Box, Typography } from '@mui/material';
import { EditServiceButton } from '@features/osi/accruals/service/edit';
import { OsiServiceResponse, ServiceGroupResponse } from '@shared/types/osi/services';
import { OsiServiceAbonentsButton } from '@features/osi/accruals/abonents';
import { useTranslation } from '@shared/utils/i18n';
import { ServiceStatus } from '@entities/osi/accruals/serviceStatus';
import { EditAdditionalServiceButton } from '@features/osi/accruals/additionalService/edit';

interface Props {
  group: ServiceGroupResponse;
  reloadCb: () => Promise<void>;
}

export const ServiceTable: React.FC<Props> = observer(({ group, reloadCb }) => {
  const { t, getGridLocale: ggl } = useTranslation();

  const isAbonentsFeatureEnabled = group.canEditAbonents && group.id !== 7;

  const fields: GridColDef[] | boolean[] = [
    {
      field: '_edit',
      headerName: '',
      align: 'center',
      headerAlign: 'center',
      width: 60,
      renderCell: (params: GridRenderCellParams<any, OsiServiceResponse>) => {
        if (params.row.serviceGroupId === 7) {
          return (
            <EditAdditionalServiceButton
              service={params.row}
              defaultServiceNames={group.serviceNameExamples ?? []}
              reloadCb={reloadCb}
            />
          );
        }

        return (
          <EditServiceButton
            service={params.row}
            accrualMethods={group.accuralMethods ?? []}
            defaultServiceNames={group.serviceNameExamples ?? []}
            reloadCb={reloadCb}
          />
        );
      }
    },
    {
      field: 'status',
      headerName: t('common:status'),
      align: 'center',
      headerAlign: 'center',
      width: 125,
      renderCell: (params: GridRenderCellParams<any, OsiServiceResponse>) => <ServiceStatus service={params.row} />
    },
    { field: 'nameRu', headerName: t('accruals:service'), align: 'center', headerAlign: 'center', flex: 1 },
    { field: 'amount', headerName: t('common:tariff'), align: 'center', headerAlign: 'center', flex: 1 },
    {
      field: '_abonents',
      headerName: t('common:abonents'),
      align: 'center',
      headerAlign: 'center',
      width: 200,
      renderCell: (params: GridRenderCellParams<any, OsiServiceResponse>) => (
        <OsiServiceAbonentsButton service={params.row} reloadCb={reloadCb} />
      )
    }
  ];
  const columns = isAbonentsFeatureEnabled ? fields : fields.filter((field: GridColDef) => field.field !== '_abonents');

  const sx = {
    border: 'none',
    minHeight: `${50 + (group?.services?.length ?? 0) * 45}px`,
    '& .MuiDataGrid-columnHeaders': {
      color: '#919EAB',
      backgroundColor: 'rgba(145, 158, 171, 0.16)'
    },
    '& .MuiDataGrid-columnHeader': {
      borderRight: 'none !important'
    },
    '& .MuiDataGrid-row': {
      marginTop: '5px',
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
      border: 'none',
      '&:focus-within': {
        outline: 'none !important'
      }
    }
  };

  return (
    <Box>
      {group?.services?.length ? (
        <DataGridPro
          sx={sx}
          rowHeight={40}
          headerHeight={35}
          rows={group?.services}
          localeText={ggl()}
          columns={columns}
          hideFooter
        />
      ) : (
        <Typography>{t('common:empty')}</Typography>
      )}
    </Box>
  );
});
