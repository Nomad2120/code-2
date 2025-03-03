import { OsiAccount } from '@shared/types/osi';
import { AccountFormWithFile } from '@shared/types/osi/accounts';
import { IOsiAccountApplicationsWidgetViewModel } from '@shared/types/mobx/widgets/OsiAccountApplications';

export interface OsiAccountsWidgetViewModel {
  accounts: OsiAccount[];
  isLoading: boolean;
  loadAccounts: () => Promise<void>;
  addAccount: (data: AccountFormWithFile) => Promise<void>;
  editAccount: (data: AccountFormWithFile & { id: number }) => Promise<void>;
  deleteAccount: (account: OsiAccount) => Promise<void>;
  isCreatingDisabled: boolean;
  applicationsVm: IOsiAccountApplicationsWidgetViewModel | null;
}

export const token = Symbol.for('OsiAccountsWidgetViewModel');
