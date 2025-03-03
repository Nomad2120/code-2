import { makeAutoObservable } from 'mobx';
import { OsiServiceCompaniesWidgetViewModel } from '@shared/types/mobx/widgets/OsiServiceCompaniesWidget';
import { OsiServiceCompany } from '@shared/types/osi/osiServiceCompanies';
import { injectable } from 'inversify';
import { getServiceCompaniesByOsiId } from '@shared/api/osi/serviceCompanies';
import { OsiModule } from '@mobx/services/osiModule';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';

@injectable()
export class OsiServiceCompaniesVm implements OsiServiceCompaniesWidgetViewModel {
  serviceCompanies: OsiServiceCompany[] = [];

  isLoading = false;

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);

    this.loadServiceCompanies();
  }

  loadServiceCompanies = async () => {
    try {
      if (!this.osiModule?.osiId) return;
      this.isLoading = true;
      this.serviceCompanies = await getServiceCompaniesByOsiId(this.osiModule.osiId);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };
}
