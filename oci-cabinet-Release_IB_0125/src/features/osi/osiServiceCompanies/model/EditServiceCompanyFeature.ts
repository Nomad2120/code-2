import { EditOsiServiceCompanyButtonViewModelInterface } from '@shared/types/mobx/features/OsiServiceCompanies';
import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import {
  OsiServiceCompany,
  OsiServiceCompanyForm,
  OsiServiceCompanyRequest,
  ServiceCompanyCodes
} from '@shared/types/osi/osiServiceCompanies';
import { DictionaryModule } from '@mobx/services/dictionaries/model/DictionaryModule';
import { ServiceCompany } from '@shared/types/dictionaries';
import logger from 'js-logger';
import { createOsiServiceCompany, updateOsiServiceCompany } from '@shared/api/osiServiceCompanies';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { OsiModule } from '@mobx/services/osiModule';

const initialValues: OsiServiceCompanyForm = {
  code: ServiceCompanyCodes.ELECTRIC,
  phones: '',
  addresses: ''
};

@injectable()
export class EditServiceCompanyFeature implements EditOsiServiceCompanyButtonViewModelInterface {
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
    this.hookForm.reset(this.defaultValues);
    this.hookForm.trigger();
    this.isDialogOpen = false;
  };

  onEditClick = (company: OsiServiceCompany): void => {
    if (!company.id) return;

    const editValues: OsiServiceCompanyForm & { id: number } = {
      code: company.serviceCompanyCode || 0,
      addresses: company.addresses || '',
      phones: company.phones || '',
      id: company.id
    };

    this.hookForm.reset(editValues);
    this.hookForm.trigger();
    this.isDialogOpen = true;
  };

  onSaveDialogClick = (): void => {
    this.hookForm.handleSubmit(this.saveServiceCompany)();
  };

  setForm = (hookForm: any): void => {
    this.hookForm = hookForm;
  };

  private saveServiceCompany = async (data: OsiServiceCompanyForm & { id: number }): Promise<void> => {
    if (!this.osiModule?.osiId) return;

    const payload: OsiServiceCompanyRequest = {
      addresses: data.addresses,
      osiId: this.osiModule.osiId,
      phones: data.phones,
      serviceCompanyCode: data.code
    };

    try {
      await updateOsiServiceCompany(data.id, payload);
      this.reloadServices();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.onCloseDialogClick();
    }
  };
}
