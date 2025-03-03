import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { IOsiPaymentOrdersWidgetViewModel } from '@shared/types/mobx/widgets/OsiPaymentOrdersWidget';
import moment from 'moment';
import api from '@app/api';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { OsiModule } from '@mobx/services/osiModule';
import logger from 'js-logger';

@injectable()
export class OsiPaymentOrdersWidgetViewModel implements IOsiPaymentOrdersWidgetViewModel {
  endDate: any = moment().endOf('month').toDate();

  isLoading = false;

  startDate: any = moment().startOf('month').toDate();

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);
  }

  download = async (): Promise<void> => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');

      this.isLoading = true;

      const db = moment.utc(this.startDate).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      const de = moment.utc(this.endDate).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      const data = await api.getPaymentOrdersReport(this.osiModule.osiId, db, de);
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
      a.download = `Свод_платежных_поручений_${osiName}_дом_${house}_${db.substring(0, 10)}_${de.substring(
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
}
