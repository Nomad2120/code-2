import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { tokens, useTranslation } from '@shared/utils/i18n';
import {
  AddServiceCompanyButton,
  EditServiceCompanyButton,
  DeleteServiceCompanyButton,
  PrintServiceCheckbox
} from '@features/osi/osiServiceCompanies';
import { DataGridPro, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid-pro';
import { useInjection } from 'inversify-react';
import {
  OsiServiceCompaniesWidgetViewModel,
  token as OsiServiceCompaniesWidgetVm
} from '@shared/types/mobx/widgets/OsiServiceCompaniesWidget';
import { observer } from 'mobx-react-lite';

export const OsiServiceCompaniesWidget: React.FC = observer(() => {
  const vm = useInjection<OsiServiceCompaniesWidgetViewModel>(OsiServiceCompaniesWidgetVm);
  const { translateToken: tt, fieldWithPrefix: fwp, getGridLocale: ggl, getLocale: gl } = useTranslation();

  const columns: GridColDef[] = [
    {
      field: 'edit',
      headerName: '',
      renderCell: (params: GridRenderCellParams) => (
        <EditServiceCompanyButton company={params.row} onUpdateSuccess={vm.loadServiceCompanies} />
      ),
      width: 80
    },
    {
      field: 'print',
      headerName: tt(tokens.osiInfo.companies.table.print),
      renderCell: (params: GridRenderCellParams) => <PrintServiceCheckbox serviceCompany={params.row} />,
      width: 100,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'type',
      headerName: tt(tokens.osiInfo.companies.table.type),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams) => {
        if (!params.row) return '';
        return fwp(params.row, 'serviceCompanyName');
      }
    },
    {
      field: 'phones',
      headerName: tt(tokens.osiInfo.companies.table.phones),
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'addresses',
      headerName: tt(tokens.osiInfo.companies.table.address),
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'delete',
      headerName: '',
      renderCell: (params: GridRenderCellParams) => (
        <DeleteServiceCompanyButton company={params.row} onDeleteSuccess={vm.loadServiceCompanies} />
      ),
      width: 80
    }
  ];

  return (
    <Card sx={{ maxWidth: 1000, minWidth: 800 }}>
      <CardHeader
        subheader={
          <Box display="flex" alignItems="center">
            <Typography variant="h5" color="textPrimary">
              {tt(tokens.osiInfo.companies.title)}
            </Typography>
            <AddServiceCompanyButton onAddSuccess={vm.loadServiceCompanies} />
          </Box>
        }
      />
      <CardContent sx={{ height: 400 + 42 + 24 }}>
        <Box sx={{ height: 400 }}>
          <DataGridPro
            rows={vm.serviceCompanies}
            columns={columns}
            localeText={ggl()}
            hideFooter
            rowHeight={40}
            headerHeight={gl() === 'ru' ? 40 : 60}
            loading={vm.isLoading}
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
      </CardContent>
    </Card>
  );
});
