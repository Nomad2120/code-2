import { observer } from 'mobx-react-lite';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { AddAccountButton, DeleteAccountButton, EditAccountButton } from '@features/osi/accounts';
import { DataGridPro, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid-pro';
import { OsiAccountsWidgetViewModel, token as OsiAccountsWidgetVm } from '@shared/types/mobx/widgets/OsiAccountsWidget';
import { useInjection } from 'inversify-react';
import { useEffect } from 'react';
import { OsiAccount } from '@shared/types/osi';
import { IRegistrationAccountsWidgetViewModel } from '@shared/types/mobx/widgets/RegistrationAccounts';
import { RegistrationAccount } from '@shared/types/registration';
import { AccountApplications } from '@widgets/osi/accountApplications';

interface Props {
  onChangeAccounts?: (accounts: OsiAccount[] | RegistrationAccount[]) => void;
  viewModelToken?: symbol;
}

export const OsiAccountsWidget: React.FC<Props> = observer(({ onChangeAccounts, viewModelToken }) => {
  const vm = useInjection<OsiAccountsWidgetViewModel | IRegistrationAccountsWidgetViewModel>(
    viewModelToken ?? OsiAccountsWidgetVm
  );

  const { translateToken: tt, fieldWithPrefix: fwp, getGridLocale: ggl } = useTranslation();

  useEffect(() => {
    if (!onChangeAccounts) return;

    onChangeAccounts(vm.accounts);
  }, [vm.accounts]);

  const columns: GridColDef[] = [
    {
      field: 'edit',
      headerName: '',
      renderCell: (params: GridRenderCellParams) => (
        <EditAccountButton account={params.row} editAccountCb={vm.editAccount} />
      ),
      width: 80
    },
    {
      field: 'type',
      headerName: tt(tokens.osiInfo.bills.table.billType),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams) => {
        if (!params.row) return '';
        return fwp(params.row, 'accountTypeName');
      }
    },
    {
      field: 'account',
      headerName: tt(tokens.osiInfo.bills.table.bill),
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'bic',
      headerName: tt(tokens.osiInfo.bills.table.IDNBank),
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'delete',
      headerName: '',
      renderCell: (params: GridRenderCellParams) => (
        // @ts-expect-error need to couple two different types
        <DeleteAccountButton account={params.row} deleteAccountCb={vm.deleteAccount} />
      ),
      width: 80
    }
  ];

  return (
    <>
      <Card sx={{ maxWidth: 1000, minWidth: 800 }}>
        <CardHeader
          subheader={
            <Box display="flex" alignItems="center">
              <Typography variant="h5" color="textPrimary">
                {tt(tokens.osiInfo.bills.title)}
              </Typography>
              {!vm.isLoading && <AddAccountButton addAccountCb={vm.addAccount} accounts={vm.accounts} />}
            </Box>
          }
        />
        <CardContent sx={{ height: 200 + 42 + 24 }}>
          <Box sx={{ height: 200 }}>
            <DataGridPro
              rows={vm.accounts}
              columns={columns}
              localeText={ggl()}
              hideFooter
              rowHeight={40}
              headerHeight={40}
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
      {'applicationsVm' in vm && (
        <AccountApplications
          onVmInit={(applicationVm) => {
            vm.applicationsVm = applicationVm;
          }}
        />
      )}
    </>
  );
});
