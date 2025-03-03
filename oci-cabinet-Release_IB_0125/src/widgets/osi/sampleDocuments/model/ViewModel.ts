import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { IOsiSampleDocumentsWidgetViewModel } from '@shared/types/mobx/widgets/OsiSampleDocuments';
import { Abonent } from '@shared/types/osi/abonents';
import flatComparator from '@shared/utils/helpers/flatComparator';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import api from '@app/api';
import logger from 'js-logger';
import { getOsiAbonents } from '@shared/api/osi/abonents/get';
import { OsiModule } from '@mobx/services/osiModule';
import i18next from 'i18next';

@injectable()
export class OsiSampleDocumentsWidgetViewModel implements IOsiSampleDocumentsWidgetViewModel {
  isLoading = false;

  private _abonents: Abonent[] = [];

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);
    this.loadAbonents();
  }

  get sortedAbonents() {
    const preparedAbonents = this._abonents.map((abonent) => {
      if (abonent.external) {
        const arendator = { ...abonent };
        arendator.flat = `Аренда (${arendator.name})`;
        return arendator;
      }
      return abonent;
    });

    return preparedAbonents.sort((a, b) => flatComparator(a.flat, b.flat));
  }

  downloadDebtor = async (abonent: Abonent) => {
    try {
      this.isLoading = true;
      // @ts-expect-error api endpoint not typed
      const { docBase64 } = await api.getDebtorNotification(abonent.id);
      const fetchData = `data:application/docx;base64,${docBase64}`;
      const a = document.createElement('a');
      a.href = fetchData;
      a.download = `Уведомление_должнику_${abonent.flat}_${new Date().toISOString().substring(0, 10)}.docx`;
      a.click();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  downloadNotary = async (abonent: Abonent) => {
    try {
      this.isLoading = true;
      // @ts-expect-error api endpoint not typed
      const { docBase64 } = await api.getNotaryNotification(abonent.id);
      const fetchData = `data:application/docx;base64,${docBase64}`;
      const a = document.createElement('a');
      a.href = fetchData;
      a.download = `${i18next.t('debts:notaryDocs')}_${abonent.flat}_${new Date().toISOString().substring(0, 10)}.docx`;
      a.click();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  private loadAbonents = async () => {
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
}
