import { makeAutoObservable } from 'mobx';
import { AddAccountButtonViewModelInterface } from '@shared/types/mobx/features/osiAccounts';
import { RolesModule } from '@mobx/services/roles';
import { DictionaryModule } from '@mobx/services/dictionaries/model/DictionaryModule';
import { AccountType, Bank } from '@shared/types/dictionaries';
import { AccountForm, OsiAccountTypes } from '@shared/types/osi/accounts';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { injectable } from 'inversify';
import { OsiModule } from '@mobx/services/osiModule';
import { ApplicationTypes, OsiAccountApplicationCheckRequest } from '@shared/types/osiAccountApplications';
import { checkIsHasActiveOsiAccountApplication } from '@shared/api/osiAccountApplications';
import logger from 'js-logger';
import { OsiAccount } from '@shared/types/osi';

@injectable()
export class AddAccountButtonFeature implements AddAccountButtonViewModelInterface {
  isFeatureDisabled = false;

  isDialogOpen = false;

  hookForm: any = null;

  defaultValues: AccountForm = {
    account: '',
    accountType: '',
    bank: {
      bic: '',
      name: ''
    }
  };

  accounts: OsiAccount[] = [];

  constructor(private rolesModule: RolesModule, private dictionary: DictionaryModule, private osiModule: OsiModule) {
    makeAutoObservable(this);
  }

  get accountTypes(): AccountType[] {
    return this.dictionary.accountTypes;
  }

  get banks(): Bank[] {
    return this.dictionary.banks;
  }

  get isCurrentAccountExists() {
    return this.accounts?.some((account) => account?.type === OsiAccountTypes.CURRENT) ?? false;
  }

  setFeatureStatus = (value: boolean) => {
    this.isFeatureDisabled = value;
  };

  addAccountCb: (data: AccountForm) => void = () => {};

  setForm = (hookForm: any): void => {
    this.hookForm = hookForm;
  };

  onChangeAccount = (value: string): void => {
    this.hookForm.setValue('account', value.toUpperCase());
    this.hookForm.trigger('account');
    if (value.length < 7) return;

    const bicId = value.slice(4, 7);
    const bank = this.banks.find((bank) => bank.identifier === bicId);

    console.log('banks', { bank, value, length: value.length });

    if (!bank) return;

    this.hookForm.setValue('bank', {
      bic: bank.bic,
      name: bank.name
    });
    this.hookForm.trigger();
  };

  onAddAccountClick = () => {
    if (this.isFeatureDisabled) {
      notistackExternal.warning('Для добавления счета обратитесь к оператору');
      return;
    }

    this.isDialogOpen = true;
    this.hookForm.reset(this.defaultValues);

    if (this.isCurrentAccountExists) {
      this.hookForm.setValue('accountType', OsiAccountTypes.SAVINGS);
    }
  };

  onCloseDialogClick = () => {
    this.isDialogOpen = false;
    this.hookForm.reset(this.defaultValues);
    this.hookForm.trigger();
  };

  onSaveAccountClick = async () => {
    await this.hookForm.handleSubmit(this.saveAccount)();
    this.onCloseDialogClick();
  };

  saveAccount = async (data: AccountForm) => {
    try {
      await this.checkAccountApplications(data.accountType);

      await this.addAccountCb(data);

      this.onCloseDialogClick();
    } catch (e) {
      logger.error(e);
      notistackExternal.error(e);
    }
  };

  checkAccountApplications = async (accountType: string) => {
    if (!this.osiModule.osiId) return false;

    const payload: OsiAccountApplicationCheckRequest = {
      osiId: this.osiModule.osiId,
      type: accountType as OsiAccountTypes,
      applicationType: ApplicationTypes.ADD
    };

    await checkIsHasActiveOsiAccountApplication(payload);
  };

  setAddAccountCb(cb: (data: AccountForm) => void): void {
    this.addAccountCb = cb;
  }
}
