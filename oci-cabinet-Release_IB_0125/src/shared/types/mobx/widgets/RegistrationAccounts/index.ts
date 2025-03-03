import { AccountForm } from '@shared/types/osi/accounts';
import { RegistrationAccount } from '@shared/types/registration';

export interface IRegistrationAccountsWidgetViewModel {
  accounts: RegistrationAccount[];
  isLoading: boolean;
  loadAccounts: () => Promise<void>;
  addAccount: (data: AccountForm) => Promise<void>;
  editAccount: (data: AccountForm & { id: number }) => Promise<void>;
  deleteAccount: (account: RegistrationAccount) => Promise<void>;
  isCreatingDisabled: boolean;
}

export const IRegistrationAccountsWidgetViewModelToken = Symbol.for('IRegistrationAccountsWidgetViewModel');
