import { makeAutoObservable } from 'mobx';
import { OsiAccountsWidgetViewModel } from '@shared/types/mobx/widgets/OsiAccountsWidget';
import { OsiAccount } from '@shared/types/osi';
import { injectable } from 'inversify';
import { OsiModule } from '@mobx/services/osiModule';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';
import { getOsiAccountsByOsiId } from '@shared/api/osi/accounts';
import { AccountFormWithFile, OsiAccountTypes } from '@shared/types/osi/accounts';
import { deleteOsiAccountById } from '@shared/api/osiAccounts/delete';
import { RolesModule } from '@mobx/services/roles';
import { createOsiApplication } from '@shared/api/osiAccountApplications';
import {
  ApplicationTypes,
  OsiAccountApplication,
  OsiAccountApplicationRequestWithFile
} from '@shared/types/osiAccountApplications';
import { IOsiAccountApplicationsWidgetViewModel } from '@shared/types/mobx/widgets/OsiAccountApplications';

@injectable()
export class OsiAccountsWidgetVm implements OsiAccountsWidgetViewModel {
  accounts: OsiAccount[] = [];

  isLoading = false;

  isCreatingDisabled = true;

  constructor(private osiModule: OsiModule, private rolesModule: RolesModule) {
    makeAutoObservable(this);

    this.loadAccounts();

    this.isCreatingDisabled = !(this.rolesModule.isHasAdminRole || this.rolesModule.isHasOperatorRole);
  }

  private _applicationsVm: IOsiAccountApplicationsWidgetViewModel | null = null;

  set applicationsVm(value: IOsiAccountApplicationsWidgetViewModel) {
    this._applicationsVm = value;
  }

  loadAccounts = async () => {
    try {
      this.isLoading = true;

      if (!this.osiModule?.osiInfo?.id) return;

      this.accounts = await getOsiAccountsByOsiId(this.osiModule.osiInfo.id);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  addAccount = async (data: AccountFormWithFile) => {
    try {
      if (!this.osiModule.osiId) return;

      const payloadApp: OsiAccountApplicationRequestWithFile = {
        applicationType: ApplicationTypes.ADD,
        osiId: this.osiModule.osiId,
        type: data.accountType as OsiAccountTypes,
        bic: data.bank.bic,
        account: data.account,
        docs: [data.file]
      };

      const result = await createOsiApplication(payloadApp);
    } catch (e) {
      logger.error(e);
      notistackExternal.error(e);
    } finally {
      await this.loadAccounts();
      await this._applicationsVm?.refreshApplications();
    }
  };

  editAccount = async (data: AccountFormWithFile & { id: number }) => {
    try {
      if (!this.osiModule.osiId) return;

      const payloadApp: OsiAccountApplicationRequestWithFile = {
        applicationType: ApplicationTypes.UPDATE,
        osiId: this.osiModule.osiId,
        type: data.accountType as OsiAccountTypes,
        bic: data.bank.bic,
        account: data.account,
        osiAccountId: data.id,
        docs: [data.file]
      };

      const result = await createOsiApplication(payloadApp);
    } catch (e) {
      logger.error(e);
      if (e instanceof Error) {
        notistackExternal.error(e.message);
      }
    } finally {
      await this.loadAccounts();
      await this._applicationsVm?.refreshApplications();
    }
  };

  deleteAccount = async (account: OsiAccount) => {
    try {
      if (!account.id) return;
      await deleteOsiAccountById(account.id);
      await this.loadAccounts();
    } catch (e) {
      logger.error(e);
      notistackExternal.error(e);
    }
  };

  openApplicationDocs = async (application: OsiAccountApplication) => {
    await this._applicationsVm?.showApplicationInfo(application);
  };
}
