import { AccountType, Bank } from '@shared/types/dictionaries';
import { AccountForm } from '@shared/types/osi/accounts';
import { RegistrationAccount } from '@shared/types/registration';

export interface AddAccountButtonViewModelInterface {
  isFeatureDisabled: boolean;
  setFeatureStatus: (value: boolean) => void;
  isDialogOpen: boolean;
  setForm: (hookForm: any) => void;
  accountTypes: AccountType[];
  banks: Bank[];
  defaultValues: AccountForm;
  onAddAccountClick: () => void;
  onCloseDialogClick: () => void;
  onSaveAccountClick: () => void;
  onChangeAccount: (value: string) => void;
  addAccountCb: (data: AccountForm) => void;
  setAddAccountCb: (cb: (data: AccountForm) => void) => void;
  setAccounts: (value: RegistrationAccount[]) => void;
}

export const addAccountButtonViewModelToken = Symbol.for('AddRegistrationAccountButtonViewModelInterface');
