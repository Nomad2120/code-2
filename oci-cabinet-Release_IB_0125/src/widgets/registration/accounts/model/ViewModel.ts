import { IRegistrationAccountsWidgetViewModel } from '@shared/types/mobx/widgets/RegistrationAccounts';
import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { AccountForm } from '@shared/types/osi/accounts';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { getAccountsByRegistrationId } from '@shared/api/registration/accounts';
import { RegistrationModule } from '@mobx/services/registration';
import { RegistrationAccount, RegistrationAccountRequest } from '@shared/types/registration';
import { createRegistrationAccount } from '@shared/api/registrationAccounts/create';
import { AccountTypeCodes } from '@shared/types/dictionaries';
import { updateRegistrationAccount } from '@shared/api/registrationAccounts/update';
import { deleteRegistrationAccountById } from '@shared/api/registrationAccounts/delete';

@injectable()
export class RegistrationAccountsWidgetViewModel implements IRegistrationAccountsWidgetViewModel {
  accounts: RegistrationAccount[] = [];

  isLoading = false;

  isCreatingDisabled = false;

  constructor(private registrationModule: RegistrationModule) {
    makeAutoObservable(this);

    this.loadAccounts();

    this.isCreatingDisabled = false;
  }

  loadAccounts = async () => {
    try {
      this.isLoading = true;

      if (!this.registrationModule.selectedRegistration?.id) return;
      this.accounts = await getAccountsByRegistrationId(this.registrationModule.selectedRegistration?.id);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  addAccount = async (data: AccountForm) => {
    try {
      if (!this.registrationModule.selectedRegistration?.id) return;

      const payload: RegistrationAccountRequest = {
        registrationId: this.registrationModule.selectedRegistration?.id,
        type: data.accountType as AccountTypeCodes,
        bic: data.bank.bic,
        account: data.account
      };

      await createRegistrationAccount(payload);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      await this.loadAccounts();
    }
  };

  editAccount = async (data: AccountForm & { id: number }) => {
    try {
      if (!this.registrationModule.selectedRegistration?.id) return;

      const payload: RegistrationAccountRequest = {
        registrationId: this.registrationModule.selectedRegistration?.id,
        type: data.accountType as AccountTypeCodes,
        bic: data.bank.bic,
        account: data.account
      };

      await updateRegistrationAccount(data.id, payload);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      await this.loadAccounts();
    }
  };

  deleteAccount = async (account: RegistrationAccount) => {
    try {
      if (!account.id) return;
      await deleteRegistrationAccountById(account.id);
      await this.loadAccounts();
    } catch (e) {
      logger.error(e);
      notistackExternal.error(e);
    }
  };
}
