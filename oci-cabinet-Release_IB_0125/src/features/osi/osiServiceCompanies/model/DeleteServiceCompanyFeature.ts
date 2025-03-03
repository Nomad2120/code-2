import { makeAutoObservable } from 'mobx';
import { DeleteOsiServiceCompanyButtonViewModelInterface } from '@shared/types/mobx/features/OsiServiceCompanies';
import { injectable } from 'inversify';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { OsiServiceCompany } from '@shared/types/osi/osiServiceCompanies';
import { deleteOsiServiceCompany } from '@shared/api/osiServiceCompanies';

@injectable()
export class DeleteServiceCompanyFeature implements DeleteOsiServiceCompanyButtonViewModelInterface {
  constructor() {
    makeAutoObservable(this);
  }

  reloadServices: () => void = () => {};

  onConfirmDeleteClick = async (company: OsiServiceCompany): Promise<void> => {
    try {
      if (!company.id) return;
      await deleteOsiServiceCompany(company.id);
      this.reloadServices();
    } catch (e) {
      logger.error(e);
      notistackExternal.error(e);
    }
  };

  setReloadServices = (reloadServices: () => void): void => {
    this.reloadServices = reloadServices;
  };
}
