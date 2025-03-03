import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { useAccountsForm } from '@features/osi/accounts/hooks/useAccontsForm';
import { useEffect } from 'react';
import { AccountForm } from '@shared/types/osi/accounts';
import { TooltipButton } from '@widgets/registration/accounts/ui/TooltipButton';
import { AddAccountDialog } from '@widgets/registration/accounts/ui/AddAccountDialog';
import {
  addAccountButtonViewModelToken,
  AddAccountButtonViewModelInterface
} from '@shared/types/mobx/features/registration/accounts';
import { RegistrationAccount } from '@shared/types/registration';
import { useTranslation } from '@shared/utils/i18n';

interface Props {
  addAccountCb: (data: AccountForm) => void;
  accounts: RegistrationAccount[];
}

// TODO: добавить переводы

export const AddAccountButton: React.FC<Props> = observer(({ addAccountCb, accounts }) => {
  const vm = useInjection<AddAccountButtonViewModelInterface>(addAccountButtonViewModelToken);
  const { defaultValues, banks, accountTypes } = vm;
  const { form } = useAccountsForm({ defaultValues });
  const { t } = useTranslation();

  useEffect(() => {
    vm.setAccounts(accounts);
  }, [accounts]);

  useEffect(() => {
    vm.setForm(form);
  }, [form, vm]);

  useEffect(() => {
    vm.setAddAccountCb(addAccountCb);
  }, [vm, addAccountCb]);

  return (
    <>
      <TooltipButton
        title={t('registration:allRegistrationAccountsFilled')}
        disabled={vm.isFeatureDisabled}
        onClick={vm.onAddAccountClick}
      />

      <AddAccountDialog
        isOpen={vm.isDialogOpen}
        onClose={vm.onCloseDialogClick}
        form={form}
        banks={banks}
        accountTypes={accountTypes}
        onSaveClick={vm.onSaveAccountClick}
        onChangeAccount={vm.onChangeAccount}
      />
    </>
  );
});
