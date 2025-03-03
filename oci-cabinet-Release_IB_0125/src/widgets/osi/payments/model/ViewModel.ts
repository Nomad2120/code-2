import { IOsiPaymentsWidgetViewModel } from '@shared/types/mobx/widgets/OsiPayments';
import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import { OsiModule } from '@mobx/services/osiModule';
import api from '@app/api';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';

@injectable()
export class OsiPaymentsWidgetViewModel implements IOsiPaymentsWidgetViewModel {
  isLoading = false;

  payments: any = [];

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);
  }

  private _dateBegin: any = new Date();

  get dateBegin(): any {
    return this._dateBegin;
  }

  set dateBegin(value: any) {
    this._dateBegin = value;
    this.period = [moment(value).startOf('month').toDate(), moment(this.dateEnd).endOf('month').toDate()];
  }

  private _dateEnd: any = new Date();

  period: any = [moment(this._dateBegin).startOf('month').toDate(), moment(this._dateEnd).endOf('month').toDate()];

  get dateEnd(): any {
    return this._dateEnd;
  }

  set dateEnd(value: any) {
    this._dateEnd = value;
    this.period = [moment(this.dateBegin).startOf('month').toDate(), moment(value).endOf('month').toDate()];
  }

  get rows() {
    return this.payments?.map((e: any, idx: number) => ({ id: idx, ...e })) || [];
  }

  downloadReport = async (): Promise<void> => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');

      this.isLoading = true;

      const data = await api.getPaymentsReport(
        this.osiModule.osiId,
        moment.utc(this.period[0]).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
        moment.utc(this.period[1]).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]')
      );
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
      a.download = `Реестр_платежей_${osiName}_дом_${house}_${this.period[0]
        .toISOString()
        .substring(0, 10)}_${this.period[1].toISOString().substring(0, 10)}.xlsx`;
      a.click();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  loadPayments = async (): Promise<void> => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');

      this.isLoading = true;

      const resp = await api.getPayments(
        this.osiModule.osiId,
        moment.utc(this.period[0]).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
        moment.utc(this.period[1]).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]')
      );
      // @ts-expect-error api is not typed
      const sortedResp = resp.sort((a, b) => {
        if (a?.dt < b?.dt) return -1;
        if (a?.dt > b?.dt) return 1;
        return 0;
      });
      this.payments = sortedResp || [];
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };
}
