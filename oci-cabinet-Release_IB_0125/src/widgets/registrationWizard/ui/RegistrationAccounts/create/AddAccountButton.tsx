import { observer } from 'mobx-react-lite';
import { useAccountsForm } from '@features/osi/accounts/hooks/useAccontsForm';
import { useState } from 'react';
import { AccountForm } from '@shared/types/osi/accounts';
import { AddAccountDialog } from '@widgets/registration/accounts/ui/AddAccountDialog';
import { DocTypeCodes } from '@shared/types/registration';
import { useTranslation } from '@shared/utils/i18n';
import { useRegistrationWizardContext } from '@widgets/registrationWizard/store/RegistrationWizardProvider';
import { usePostApiRegistrationAccounts } from '@shared/api/orval/registration-accounts/registration-accounts';
import { queryClient } from '@shared/api/reactQuery';
import { getGetApiRegistrationsIdAccountsQueryKey } from '@shared/api/orval/registrations/registrations';
import { RequestsRegistrationAccountRequest } from '@shared/api/orval/models';
import { AccountTypeCodes } from '@shared/types/dictionaries';
import { useRegistrationAccounts } from '@widgets/registrationWizard/hooks/RegistrationAccounts/useRegistrationAccounts';
import { useGetApiCatalogsAccountTypes, useGetApiCatalogsBanks } from '@shared/api/orval/catalogs/catalogs';
import { TooltipButton } from './TooltipButton';

// TODO: добавить переводы

const defaultValues: AccountForm = {
  account: '',
  accountType: '',
  bank: {
    bic: '',
    name: ''
  }
};

export const AddAccountButton: React.FC = observer(() => {
  const wizard = useRegistrationWizardContext();
  const { accounts, docs, isAllAccountsFilled } = useRegistrationAccounts();
  const { data: banksResponse, isLoading: isLoadingBanks } = useGetApiCatalogsBanks();
  const { data: accountTypesResponse, isLoading: isLoadingAccountTypes } = useGetApiCatalogsAccountTypes();
  const { form } = useAccountsForm({ defaultValues });
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const banks = banksResponse?.result;
  const accountTypes = accountTypesResponse?.result;

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const addAccountMutation = usePostApiRegistrationAccounts({
    mutation: {
      onSuccess: async () => {
        await queryClient.refetchQueries({
          queryKey: getGetApiRegistrationsIdAccountsQueryKey(wizard?.registration?.id ?? 0)
        });
      }
    }
  });

  const onAddAccountClick = async () => {
    await defineAccountType();
    openDialog();
  };

  const defineAccountType = async () => {
    const isCurrentAccountExists = accounts?.some((account) => account.type === AccountTypeCodes.CURRENT);

    form.reset(defaultValues);
    if (!accounts?.length || !isCurrentAccountExists) {
      await setAccountType(AccountTypeCodes.CURRENT);
      return;
    }
    const isSavingAccountNeed = docs?.some((doc) => doc.docTypeCode === DocTypeCodes.SAVING_IBAN_INFO);
    const isSavingsAccountExists = accounts?.some((account) => account.type === AccountTypeCodes.SAVINGS);

    if (isSavingAccountNeed && !isSavingsAccountExists) {
      await setAccountType(AccountTypeCodes.SAVINGS);
      return;
    }

    await setAccountType(AccountTypeCodes.CURRENT);
  };

  const setAccountType = async (accountType: AccountTypeCodes) => {
    form.setValue('accountType', accountType, { shouldValidate: true });
    await form.trigger('accountType');
  };

  const createAccount = async (values: any) => {
    if (!wizard.registration?.id) return;
    const payload: RequestsRegistrationAccountRequest = {
      registrationId: wizard.registration.id,
      type: values.accountType as AccountTypeCodes,
      bic: values.bank.bic,
      account: values.account
    };

    addAccountMutation.mutate({ data: payload });
  };

  const onChangeAccount = async (value: string): Promise<void> => {
    if (!banks?.length) return;

    form.setValue('account', value.toUpperCase(), { shouldValidate: true });
    await form.trigger('account');
    if (value.length < 7) return;

    const bicId = value.slice(4, 7);
    const bank = banks.find((bank) => bank.identifier === bicId);

    if (!bank) return;

    form.setValue(
      'bank',
      {
        bic: bank.bic ?? '',
        name: bank.name ?? ''
      },
      { shouldValidate: true }
    );
    await form.trigger('bank');
  };

  const onSaveAccountClick = async (values: any) => {
    await createAccount(values);
    closeDialog();
  };

  return (
    <>
      <TooltipButton
        title={t('registration:allRegistrationAccountsFilled')}
        disabled={isAllAccountsFilled()}
        onClick={onAddAccountClick}
      />

      <AddAccountDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        form={form}
        banks={banks ?? []}
        accountTypes={accountTypes ?? []}
        onSaveClick={form.handleSubmit(onSaveAccountClick)}
        onChangeAccount={onChangeAccount}
      />
    </>
  );
});
