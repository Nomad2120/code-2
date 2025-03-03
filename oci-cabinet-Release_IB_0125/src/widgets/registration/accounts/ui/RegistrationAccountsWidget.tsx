import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import {
  IRegistrationAccountsWidgetViewModel,
  IRegistrationAccountsWidgetViewModelToken
} from '@shared/types/mobx/widgets/RegistrationAccounts';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { useEffect } from 'react';
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid-pro';
import { DeleteAccountButton, EditAccountButton } from '@features/osi/accounts';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { OsiAccount } from '@shared/types/osi';
import { RegistrationAccount } from '@shared/types/registration';
import { AccountsDataGrid } from '@widgets/registration/accounts/ui/AccountsDataGrid';
import { AddAccountButton } from '@widgets/registration/accounts/ui/AddAccountButton';

interface Props {
  onChangeAccounts?: (accounts: OsiAccount[] | RegistrationAccount[]) => void;
}

export const RegistrationAccountsWidget: React.FC<Props> = observer(({ onChangeAccounts }) => {
  const vm = useInjection<IRegistrationAccountsWidgetViewModel>(IRegistrationAccountsWidgetViewModelToken);

  const { translateToken: tt, fieldWithPrefix: fwp, t } = useTranslation();

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
    <Card sx={{ maxWidth: 1000, minWidth: 800 }}>
      <CardHeader
        subheader={
          <Box display="flex" alignItems="center">
            <Typography variant="h5" color="textPrimary">
              {t('registration:accounts')}
            </Typography>
            <AddAccountButton addAccountCb={vm.addAccount} accounts={vm.accounts} />
          </Box>
        }
      />
      <CardContent sx={{ height: 200 + 42 + 24 }}>
        <AccountsDataGrid columns={columns} rows={vm.accounts} height={200} isLoading={vm.isLoading} />
      </CardContent>
    </Card>
  );
});
