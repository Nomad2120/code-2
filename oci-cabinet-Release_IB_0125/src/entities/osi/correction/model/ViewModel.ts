import { IOsiCorrectionFormViewModel } from '@shared/types/mobx/entities/osiCorrections';
import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { Abonent } from '@shared/types/osi/abonents';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';

const additionalServiceGroupId = 7;

@injectable()
export class OsiCorrectionFormViewModel implements IOsiCorrectionFormViewModel {
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  private _abonents: Abonent[] = [];

  set abonents(value: Abonent[]) {
    this._abonents = value;
  }

  private _onSubmitCb: any = async () => {};

  set onSubmitCb(value: any) {
    this._onSubmitCb = value;
  }

  private _services: any = [];

  get services(): any {
    return this._services;
  }

  set services(value: any) {
    this._services = value;
  }

  getAbonents = (serviceGroupId: number): Abonent[] => {
    if (serviceGroupId === additionalServiceGroupId) {
      return this._abonents?.filter((abonent: any) => abonent.external);
    }

    return this._abonents?.filter((abonent: any) => abonent.external === false);
  };

  onSubmit = async (values: any): Promise<void> => {
    try {
      this.isLoading = true;

      await this._onSubmitCb?.(values);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };
}
