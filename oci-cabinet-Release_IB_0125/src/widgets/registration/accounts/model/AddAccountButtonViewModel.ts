import { AddAccountButtonViewModelInterface } from '@shared/types/mobx/features/registration/accounts';
import { injectable } from 'inversify';
import { autorun, makeAutoObservable } from 'mobx';
import { AccountForm } from '@shared/types/osi/accounts';
import { AccountType, AccountTypeCodes, Bank } from '@shared/types/dictionaries';
import { DictionaryModule } from '@mobx/services/dictionaries/model/DictionaryModule';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { RegistrationModule } from '@mobx/services/registration';
import { RegistrationAccount } from '@shared/types/registration';
import { DocTypeCodes } from '@mobx/interfaces';

const CLOSE_ANIMATION_TRANSITION_DELAY = 350;

@injectable()
export class ViewModel implements AddAccountButtonViewModelInterface {
  defaultValues: AccountForm = {
    account: '',
    accountType: '',
    bank: {
      bic: '',
      name: ''
    }
  };

  hookForm: any = null;

  isDialogOpen = false;

  isFeatureDisabled = false;

  private _accounts: RegistrationAccount[] = [];

  constructor(private dictionary: DictionaryModule, private registrationModule: RegistrationModule) {
    makeAutoObservable(this);

    autorun(async () => {
      await this.defineAccountType();
    });
  }

  get accountTypes(): AccountType[] {
    return this.dictionary.accountTypes;
  }

  get banks(): Bank[] {
    return this.dictionary.banks;
  }

  addAccountCb: (data: AccountForm) => void = () => {};

  onAddAccountClick = async () => {
    if (this.isFeatureDisabled) {
      notistackExternal.warning('Для добавления счета обратитесь к оператору');
      return;
    }
    await this.defineAccountType();
    this.isDialogOpen = true;
  };

  onChangeAccount = async (value: string): Promise<void> => {
    this.hookForm.setValue('account', value.toUpperCase(), { shouldValidate: true });
    await this.hookForm.trigger('account');
    if (value.length < 7) return;

    const bicId = value.slice(4, 7);
    const bank = this.banks.find((bank) => bank.identifier === bicId);

    if (!bank) return;

    this.hookForm.setValue(
      'bank',
      {
        bic: bank.bic,
        name: bank.name
      },
      { shouldValidate: true }
    );
    await this.hookForm.trigger('bank');
  };

  onCloseDialogClick = () => {
    this.isDialogOpen = false;
  };

  onSaveAccountClick = async () => {
    await this.hookForm.handleSubmit(this.saveAccount)();
    this.onCloseDialogClick();
  };

  saveAccount = async (data: AccountForm) => {
    try {
      await this.addAccountCb(data);
    } catch (e) {
      logger.error(e);
      notistackExternal.error(e);
    }
  };

  setAddAccountCb(cb: (data: AccountForm) => void): void {
    this.addAccountCb = cb;
  }

  setFeatureStatus(value: boolean): void {
    this.isFeatureDisabled = value;
  }

  setForm(hookForm: any): void {
    this.hookForm = hookForm;
  }

  setAccounts(value: RegistrationAccount[]): void {
    this._accounts = value;
  }

  private defineAccountType = async () => {
    if (!this.hookForm) return;
    if (!this.isDialogOpen) return;

    this.hookForm.reset(this.defaultValues);

    if (!this._accounts?.length) {
      this.setAccountType(AccountTypeCodes.CURRENT);
      this.isFeatureDisabled = false;
      return;
    }

    const isSavingsAccountDocsExists = this.registrationModule?.selectedRegistration?.docs.some(
      (doc) => doc.docTypeCode === DocTypeCodes.SAVING_IBAN_INFO
    );

    const isCurrentAccountExists = this._accounts?.some((account) => account.type === AccountTypeCodes.CURRENT);
    const isSavingsAccountExists = this._accounts?.some((account) => account.type === AccountTypeCodes.SAVINGS);

    if (!isCurrentAccountExists) {
      this.setAccountType(AccountTypeCodes.CURRENT);
      this.isFeatureDisabled = false;
      return;
    }

    if (isSavingsAccountDocsExists && !isSavingsAccountExists) {
      this.setAccountType(AccountTypeCodes.SAVINGS);
      this.isFeatureDisabled = false;
      return;
    }

    this.isFeatureDisabled = true;
  };

  private setAccountType = async (accountType: AccountTypeCodes) => {
    this.hookForm.setValue('accountType', accountType, { shouldValidate: true });
    await this.hookForm.trigger('accountType');
  };
}
