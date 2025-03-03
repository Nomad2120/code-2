import fileDownload from 'js-file-download';
import { makeAutoObservable } from 'mobx';

import api from '@app/api';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { OsiModule } from '@mobx/services/osiModule';
import { getOsiAbonents } from '@shared/api/osi/abonents/get';
import { Abonent } from '@shared/types/osi/abonents';
import logger from 'js-logger';
import flatComparator from '@shared/utils/helpers/flatComparator';

export interface IPartialInvoicesStore {
  selectedIds: Array<number>;
}

@injectable()
export class PartialInvoicesStore implements IPartialInvoicesStore {
  selectedIds: Array<number>;

  isLoading = false;

  private _abonents: Abonent[] = [];

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);
    this.selectedIds = [];
    this.isLoading = false;
  }

  get sortedAbonents() {
    return this._abonents
      .map((abonent) => {
        if (abonent.external) {
          return { ...abonent, flat: `Аренда(${abonent.name})` };
        }
        return abonent;
      })
      .sort((a, b) => flatComparator(a?.flat, b?.flat));
  }

  loadAbonents = async () => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');
      this.isLoading = true;
      this._abonents = await getOsiAbonents(this.osiModule.osiId);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  restoreSelectedIds = (): Array<number> => {
    if (!this.osiModule.osiId) return [];

    const savedIds = localStorage.getItem(`${this.osiModule.osiId}selectedInvoices`);
    if (savedIds === null) return [];

    return JSON.parse(savedIds);
  };

  setSelectedIds = (ids: any): void => {
    this.selectedIds = ids;
    this.saveSelectedIds();
  };

  saveSelectedIds = (): void => {
    if (!this.osiModule.osiId) return;
    localStorage.setItem(`${this.osiModule.osiId}selectedInvoices`, JSON.stringify(this.selectedIds));
  };

  getInvoices = async (): Promise<void> => {
    try {
      this.isLoading = true;
      const data = (await api.getPartialInvoices(this.selectedIds)) as unknown as ArrayBuffer;
      fileDownload(data, `Отдельные квитанции_${new Date().toISOString()}.pdf`);
      notistackExternal.success();
      this.saveSelectedIds();
    } catch (error: any) {
      logger.error(error);
      if (error?.isAxiosError) {
        let errorObj = error.response.data;
        let message = '';
        if (
          error.request.responseType === 'blob' &&
          error.response.data instanceof Blob &&
          error.response.data.type &&
          error.response.data.type.toLowerCase().indexOf('json') !== -1
        ) {
          errorObj = JSON.parse(await error.response.data.text());
          message = errorObj?.message;
        }
        notistackExternal.error(`Ошибка при получении квитанции. ${message}`);
        return;
      }
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };
}
