import { observer } from 'mobx-react-lite';
import { useRegistrationWizardContext } from '@widgets/registrationWizard/store/RegistrationWizardProvider';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import {
  getGetApiRegistrationsIdAccountsQueryKey,
  useGetApiRegistrationsIdAccounts
} from '@shared/api/orval/registrations/registrations';
import LoadingScreen from '@shared/components/LoadingScreenFullScreen';
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid-pro';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { AccountTypeCodes } from '@shared/types/dictionaries';
import { RequestsRegistrationAccountRequest } from '@shared/api/orval/models';
import {
  useDeleteApiRegistrationAccountsId,
  usePutApiRegistrationAccountsId
} from '@shared/api/orval/registration-accounts/registration-accounts';
import { queryClient } from '@shared/api/reactQuery';
import { WizardButtons } from '@widgets/registrationWizard/ui/RegistrationAccounts/WizardButtons';
import { AccountsDataGrid } from './AccountsDataGrid';
import { AddAccountButton } from './create/AddAccountButton';
import { DeleteAccountButton } from './delete/DeleteAccountButton';
import { EditAccountButton } from './edit/EditAccountButton';

export const RegistrationAccounts: React.FC = observer(() => {
  const { translateToken: tt, fieldWithPrefix: fwp, t } = useTranslation();
  const wizard = useRegistrationWizardContext();
  const { data: accountsResponse, isLoading: isLoadingAccounts } = useGetApiRegistrationsIdAccounts(
    wizard?.registration?.id ?? 0
  );

  const deleteAccountMutation = useDeleteApiRegistrationAccountsId({
    mutation: {
      onSuccess: async () => {
        await queryClient.refetchQueries({
          queryKey: getGetApiRegistrationsIdAccountsQueryKey(wizard?.registration?.id ?? 0)
        });
      }
    }
  });

  const editAccountMutation = usePutApiRegistrationAccountsId({
    mutation: {
      onSuccess: async () => {
        await queryClient.refetchQueries({
          queryKey: getGetApiRegistrationsIdAccountsQueryKey(wizard?.registration?.id ?? 0)
        });
      }
    }
  });

  if (!wizard.registration?.id) return <LoadingScreen />;
  if (!accountsResponse?.result || isLoadingAccounts) return <LoadingScreen />;

  const { result: accounts } = accountsResponse;

  const deleteAccount = async (account) => {
    deleteAccountMutation.mutate({ id: account.id });
  };

  const editAccount = async (values) => {
    if (!wizard.registration?.id) return;

    const payload: RequestsRegistrationAccountRequest = {
      registrationId: wizard.registration.id,
      type: values.accountType as AccountTypeCodes,
      bic: values.bank.bic,
      account: values.account
    };

    editAccountMutation.mutate({ id: values.id, data: payload });
  };

  const columns: GridColDef[] = [
    {
      field: 'edit',
      headerName: '',
      renderCell: (params: GridRenderCellParams) => (
        <EditAccountButton account={params.row} editAccountCb={editAccount} />
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
        <DeleteAccountButton account={params.row} deleteAccountCb={deleteAccount} />
      ),
      width: 80
    }
  ];

  return (
    <Box>
      <Card sx={{ maxWidth: 1000, minWidth: 800 }}>
        <CardHeader
          subheader={
            <Box display="flex" alignItems="center">
              <Typography variant="h5" color="textPrimary">
                {t('registration:accounts')}
              </Typography>
              <AddAccountButton />
            </Box>
          }
        />
        <CardContent sx={{ height: 200 + 42 + 24 }}>
          <AccountsDataGrid columns={columns} rows={accounts} height={200} isLoading={isLoadingAccounts} />
        </CardContent>
      </Card>
      <WizardButtons />
    </Box>
  );
});
