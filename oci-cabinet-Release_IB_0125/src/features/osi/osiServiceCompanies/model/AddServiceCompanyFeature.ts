import { makeAutoObservable } from 'mobx';
import { AddOsiServiceCompanyButtonViewModelInterface } from '@shared/types/mobx/features/OsiServiceCompanies';
import { injectable } from 'inversify';
import {
  OsiServiceCompanyForm,
  OsiServiceCompanyRequest,
  ServiceCompanyCodes
} from '@shared/types/osi/osiServiceCompanies';
import { ServiceCompany } from '@shared/types/dictionaries';
import { DictionaryModule } from '@mobx/services/dictionaries/model/DictionaryModule';
import logger from 'js-logger';
import { createOsiServiceCompany } from '@shared/api/osiServiceCompanies';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { OsiModule } from '@mobx/services/osiModule';

const initialValues: OsiServiceCompanyForm = {
  code: ServiceCompanyCodes.ELECTRIC,
  phones: '',
  addresses: ''
};

@injectable()
export class AddServiceCompanyFeature implements AddOsiServiceCompanyButtonViewModelInterface {
  defaultValues: OsiServiceCompanyForm = initialValues;

  isDialogOpen = false;

  hookForm: any = null;

  constructor(private dictionaryModule: DictionaryModule, private osiModule: OsiModule) {
    makeAutoObservable(this);
  }

  get serviceCompanyTypes(): ServiceCompany[] {
    return this.dictionaryModule.serviceCompanies;
  }

  reloadServices = () => {};

  setReloadServices = (reloadServices: () => void): void => {
    this.reloadServices = reloadServices;
  };

  onCloseDialogClick = (): void => {
    this.isDialogOpen = false;
    this.hookForm.reset();
    this.hookForm.trigger();
  };

  onOpenDialogClick = (): void => {
    this.hookForm.reset();
    this.hookForm.trigger();
    this.isDialogOpen = true;
  };

  onSaveDialogClick = (): void => {
    this.hookForm.handleSubmit(this.saveServiceCompany)();
  };

  setForm = (hookForm: any): void => {
    this.hookForm = hookForm;
  };

  private saveServiceCompany = async (data: OsiServiceCompanyForm): Promise<void> => {
    if (!this.osiModule?.osiId) return;

    const payload: OsiServiceCompanyRequest = {
      addresses: data.addresses,
      osiId: this.osiModule.osiId,
      phones: data.phones,
      serviceCompanyCode: data.code
    };

    try {
      await createOsiServiceCompany(payload);
      this.reloadServices();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.onCloseDialogClick();
    }
  };
}
