import { AccountType, Bank } from '@shared/types/dictionaries';
import { AccountForm } from '@shared/types/osi/accounts';
import { OsiAccount } from '@shared/types/osi';

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
  accounts: OsiAccount[];
  isCurrentAccountExists: boolean;
}

export const addAccountButtonViewModelToken = Symbol.for('AddAccountButtonViewModelInterface');

export interface EditAccountButtonViewModelInterface {
  isFeatureDisabled: boolean;
  isDialogOpen: boolean;
  setForm: (hookForm: any) => void;
  accountTypes: AccountType[];
  banks: Bank[];
  defaultValues: AccountForm;
  onEditAccountClick: (account: OsiAccount) => void;
  onCloseDialogClick: () => void;
  onSaveAccountClick: () => void;
  onChangeAccount: (value: string) => void;
  editAccountCb: (data: AccountForm) => void;
  setEditAccountCb: (cb: (data: AccountForm & { id: number }) => void) => void;
}

export const editAccountButtonViewModelToken = Symbol.for('EditAccountButtonViewModelInterface');

export interface DeleteAccountButtonViewModelInterface {
  isConfirmDialogOpen: boolean;
}

export const deleteAccountButtonViewModelToken = Symbol.for('DeleteAccountButtonViewModelInterface');
