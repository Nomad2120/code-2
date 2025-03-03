import { makeAutoObservable } from 'mobx';
import { RolesModule } from '@mobx/services/roles';
import { DictionaryModule } from '@mobx/services/dictionaries/model/DictionaryModule';
import { AccountType, Bank } from '@shared/types/dictionaries';
import { AccountForm } from '@shared/types/osi/accounts';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { injectable } from 'inversify';
import { EditAccountButtonViewModelInterface } from '@shared/types/mobx/features/osiAccounts';
import { OsiAccount } from '@shared/types/osi';
import { OsiModule } from '@mobx/services/osiModule';
import { ApplicationTypes, OsiAccountApplicationCheckRequest } from '@shared/types/osiAccountApplications';
import { checkIsHasActiveOsiAccountApplication } from '@shared/api/osiAccountApplications';
import logger from 'js-logger';

const CLOSE_ANIMATION_TRANSITION_DELAY = 200;

@injectable()
export class EditAccountButtonFeature implements EditAccountButtonViewModelInterface {
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

  constructor(private rolesModule: RolesModule, private dictionary: DictionaryModule, private osiModule: OsiModule) {
    makeAutoObservable(this);

    // this.setFeatureStatus();
  }

  get accountTypes(): AccountType[] {
    return this.dictionary.accountTypes;
  }

  get banks(): Bank[] {
    return this.dictionary.banks;
  }

  editAccountCb = (data: AccountForm) => {};

  setEditAccountCb(cb: (data: AccountForm) => void): void {
    this.editAccountCb = cb;
  }

  setFeatureStatus = () => {
    this.isFeatureDisabled = !(this.rolesModule.isHasAdminRole || this.rolesModule.isHasOperatorRole);
  };

  setForm = (hookForm: any): void => {
    this.hookForm = hookForm;
  };

  onChangeAccount = (value: string): void => {
    this.hookForm.setValue('account', value.toUpperCase());
    this.hookForm.trigger('account');
    if (value.length < 7) return;

    const bicId = value.slice(4, 7);
    const bank = this.banks.find((bank) => bank.identifier === bicId);

    if (!bank) return;

    const b = this.hookForm.getValues('bank');

    this.hookForm.setValue('bank', {
      bic: bank.bic,
      name: bank.name
    });
    this.hookForm.trigger();
  };

  onEditAccountClick = async (account: OsiAccount) => {
    if (this.isFeatureDisabled) {
      notistackExternal.warning('Для добавления счета обратитесь к оператору');
      return;
    }

    if (!account.id) return;

    try {
      await this.checkAccountApplications(account);

      const editValues: AccountForm & { id: number } = {
        account: account.account,
        accountType: account.type,
        bank: {
          bic: account.bic,
          name: account.bankName || ''
        },
        id: account.id
      };

      this.isDialogOpen = true;
      this.hookForm.reset(editValues);
      this.hookForm.trigger();
    } catch (e) {
      logger.error(e);
      notistackExternal.error(e);
    }
  };

  checkAccountApplications = async (account: OsiAccount) => {
    if (!this.osiModule.osiId) return false;

    const payload: OsiAccountApplicationCheckRequest = {
      osiId: this.osiModule.osiId,
      osiAccountId: account.id,
      type: account.type,
      applicationType: ApplicationTypes.UPDATE
    };
    await checkIsHasActiveOsiAccountApplication(payload);
    return true;
  };

  onCloseDialogClick = () => {
    this.isDialogOpen = false;

    setTimeout(() => {
      this.hookForm.reset(this.defaultValues);
      this.hookForm.trigger();
    }, CLOSE_ANIMATION_TRANSITION_DELAY);
  };

  onSaveAccountClick = async () => {
    await this.hookForm.handleSubmit(this.editAccountCb)();
    this.onCloseDialogClick();
  };
}
