import { makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { IOsiPaymentFormViewModel } from '@shared/types/mobx/entities/osiPayments';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { Abonent } from '@shared/types/osi/abonents';

const additionalServiceGroupId = 7;

@injectable()
export class OsiPaymentFormViewModel implements IOsiPaymentFormViewModel {
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  private _abonents: Abonent[] = [];

  set abonents(value: Abonent[]) {
    this._abonents = value;
  }

  private _submitCb: any = async () => {};

  set submitCb(value: any) {
    this._submitCb = value;
  }

  getAbonents(serviceGroupId: number): Abonent[] {
    if (serviceGroupId === additionalServiceGroupId) {
      return this._abonents?.filter((abonent) => abonent.external);
    }

    return this._abonents?.filter((abonent) => abonent.external === false);
  }

  getAbonentOptionLabel = (option: Abonent) => {
    if (option.external === true) {
      return `Аренда(${option.name || option.flat})`;
    }

    if (!option.name) {
      return `${option.flat || 'Нет помещения'}`;
    }

    return `${option.flat || 'Нет помещения'} - ${option.name}`;
  };

  onSubmit = async (values: any): Promise<void> => {
    try {
      this.isLoading = true;

      await this._submitCb?.(values);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };
}
