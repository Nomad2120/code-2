import { injectable } from 'inversify';
import { autorun, makeAutoObservable } from 'mobx';
import { IOsiOsvWidgetViewModel } from '@shared/types/mobx/widgets/OsiOsvWidget';
import { Abonent } from '@shared/types/osi/abonents';
import flatComparator from '@shared/utils/helpers/flatComparator';
import { OsiModule } from '@mobx/services/osiModule';
import moment from 'moment';
import api from '@app/api';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { getOsvRows } from '@shared/utils/helpers/osv';
import { SettingsStore } from '@mobx/services/SettingsStore';

@injectable()
export class OsiOsvWidgetViewModel implements IOsiOsvWidgetViewModel {
  isLoading = false;

  totalsOsv: any[] = [];

  dateFieldValue = new Date();

  private _abonents: Abonent[] = [];

  private _rawAbonents: Abonent[] = [];

  constructor(private osiModule: OsiModule, private settingsStore: SettingsStore) {
    makeAutoObservable(this);
    this.loadOsv();

    autorun(() => {
      this.getAbonentRows();
    });
  }

  private _endDate = moment(new Date()).endOf('month').toDate();

  get endDate() {
    return this._endDate;
  }

  set endDate(value: any) {
    this._endDate = moment(value).endOf('month').toDate();
  }

  private _startDate = moment(new Date()).startOf('month').toDate();

  get startDate() {
    return this._startDate;
  }

  set startDate(value: any) {
    this._startDate = moment(value).startOf('month').toDate();
  }

  get sortedAbonents() {
    return this._abonents.slice().sort((a, b) => flatComparator(a.flat[0], b.flat[0]));
  }

  get abonentsCount() {
    return this._abonents.length;
  }

  downloadOsv = async (): Promise<void> => {
    try {
      if (!this.osiModule.osiId || !this.osiModule.osiInfo?.name) throw new Error('osiId or osiName is undefined');

      this.isLoading = true;
      const db = moment.utc(this._startDate).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      const de = moment.utc(this._endDate).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]');

      const data = await api.getOSVReport(this.osiModule.osiId, db, de);
      const fetchData = `data:application/xlsx;base64,${data}`;
      const a = document.createElement('a');
      a.href = fetchData;

      const house = this.osiModule.osiInfo?.address
        ?.split(',')
        .slice(-1)
        .pop()
        ?.replace('д.', '')
        .replace('дом', '')
        .trim();
      const osiName = this.osiModule.osiInfo?.name.startsWith(this.osiModule.osiInfo?.unionTypeRu ?? '')
        ? this.osiModule.osiInfo?.name
        : `${this.osiModule.osiInfo?.unionTypeRu} ${this.osiModule.osiInfo?.name}`;
      a.download = `Оборотно_сальдовая_ведомость_${osiName}_дом_${house}_${db.substring(0, 10)}_${de.substring(
        0,
        10
      )}.xlsx`;
      a.click();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  loadOsv = async (): Promise<void> => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');
      this.isLoading = true;

      const osvByPeriod = (await api.getOsvByPeriod(
        this.osiModule.osiId,
        moment.utc(this._startDate).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
        moment.utc(this._endDate).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]')
      )) as any;

      this._rawAbonents = osvByPeriod?.abonents;
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  getAbonentRows = () => {
    if (!this._rawAbonents?.length) return;

    const langKey = this.settingsStore.locale;

    const [rows, total] = getOsvRows(this._rawAbonents, langKey);
    this._abonents = rows.map((e: Abonent, id: number) => ({ id, ...e }));
    this.totalsOsv = total;
  };
}
