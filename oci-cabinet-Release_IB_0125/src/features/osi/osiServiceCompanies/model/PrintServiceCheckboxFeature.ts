import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { IPrintServiceCheckboxFeatureViewModel } from '@shared/types/mobx/features/OsiServiceCompanies';
import { OsiServiceCompany } from '@shared/types/osi/osiServiceCompanies';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';
import { updateServiceCompanyById } from '@shared/api/osiServiceCompanies';

@injectable()
export class PrintServiceCheckboxFeature implements IPrintServiceCheckboxFeatureViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  private _serviceCompany: OsiServiceCompany | null = null;

  set serviceCompany(value: OsiServiceCompany) {
    this._serviceCompany = value;
  }

  get isChecked(): boolean {
    return this._serviceCompany?.showPhones ?? false;
  }

  onClick = async (e: any) => {
    try {
      if (!this._serviceCompany?.id) return;

      const result = await updateServiceCompanyById(this._serviceCompany?.id, {
        ...this._serviceCompany,
        showPhones: !this._serviceCompany.showPhones
      });

      // TODO: тут используется оптимистическое обновление - надо получать обновленную структуру из запроса update - так будет надежнее
      this._serviceCompany.showPhones = !this._serviceCompany.showPhones;
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };
}
