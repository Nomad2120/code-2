import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import api from '@app/api';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';

@injectable()
export class AddressFieldsViewModel {
  constructor({ form }: { form: any }) {
    makeAutoObservable(this);
    this.form = form;
    this.form.trigger();
  }

  private _form: any = null;

  get form(): any {
    return this._form;
  }

  set form(value: any) {
    this._form = value;
  }

  fetchCity = async (req: string) => {
    try {
      return await api.findATS(req);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  fetchStreet = async (cityId: number, req: string) => {
    try {
      return await api.findGeonims(cityId, req);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  fetchBuilding = async (streetId: number, req: string) => {
    try {
      return await api.findBuildings(streetId, req);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };
}
