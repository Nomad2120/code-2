import { IOsiCorrectionWidgetViewModel } from '@shared/types/mobx/widgets/OsiCorrection';
import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import { OsiModule } from '@mobx/services/osiModule';
import api from '@app/api';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';

@injectable()
export class OsiCorrectionWidgetViewModel implements IOsiCorrectionWidgetViewModel {
  fixes: any = [];

  isLoading = false;

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);
  }

  private _date: any = new Date();

  period: any = [moment(this._date).startOf('month').toDate(), moment(this._date).endOf('month').toDate()];

  get date() {
    return this._date;
  }

  set date(value: any) {
    this._date = value;
    this.period = [moment(value).startOf('month').toDate(), moment(value).endOf('month').toDate()];
  }

  get rows() {
    return this.fixes?.map((e: any, idx: number) => ({ id: idx, ...e })) ?? [];
  }

  downloadReport = async (): Promise<void> => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');

      this.isLoading = true;
      const data = await api.getFixesReport(
        this.osiModule.osiId,
        moment.utc(this.period[0]).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
        moment.utc(this.period[1]).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]')
      );
      const fetchData = `data:application/xlsx;base64,${data}`;
      const a = document.createElement('a');
      a.href = fetchData;
      const osiName = this.osiModule.osiInfo?.name.startsWith(this.osiModule.osiInfo?.unionTypeRu ?? '')
        ? this.osiModule.osiInfo?.name
        : `${this.osiModule.osiInfo?.unionTypeRu} ${this.osiModule.osiInfo?.name}`;
      a.download = `Реестр_корректировок_${osiName}_${this.period[0].toISOString().substring(0, 10)}_${this.period[1]
        .toISOString()
        .substring(0, 10)}.xlsx`;
      a.click();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  loadFixes = async (): Promise<void> => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');

      this.isLoading = true;
      const resp = await api.getFixes(
        this.osiModule.osiId,
        moment.utc(this.period[0]).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
        moment.utc(this.period[1]).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]')
      );
      // @ts-expect-error api not typed
      const sortedResp = resp.sort((a, b) => {
        if (a?.dt < b?.dt) return -1;
        if (a?.dt > b?.dt) return 1;
        return 0;
      });
      this.fixes = sortedResp || [];
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };
}
