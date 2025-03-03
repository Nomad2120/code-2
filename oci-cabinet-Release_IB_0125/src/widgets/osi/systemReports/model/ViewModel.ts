import { makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { IOsiSystemReportsWidgetViewModel } from '@shared/types/mobx/widgets/OsiSystemReports';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { getDebtsByOsiId } from '@shared/api/osiSystemReports/report/debts/get';
import { OsiModule } from '@mobx/services/osiModule';
import moment from 'moment/moment';

const tMainPrefix = 'systemReports';

@injectable()
export class OsiSystemReportsWidgetViewModel implements IOsiSystemReportsWidgetViewModel {
  reports: any[] = [
    {
      id: 1,
      name: `${tMainPrefix}:debts.name`,
      comment: `${tMainPrefix}:debts.comment`,
      contentType: 'application/xlsx',
      ext: 'xlsx'
    }
  ];

  isLoading = false;

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);
  }

  async onDownloadReportClick(report: any): Promise<void> {
    try {
      if (!this.osiModule?.osiId || !this.osiModule?.osiInfo?.name) return;

      this.isLoading = true;
      const startDate = moment(new Date()).startOf('month');
      const endDate = moment(new Date()).endOf('month');
      const format = 'YYYY-MM-DD[T]HH:mm:ss[Z]';

      const period = {
        begin: startDate.local().format(format),
        end: endDate.local().format(format)
      };
      const data = await getDebtsByOsiId(this.osiModule.osiId, period);

      const fetchHref = `data:${report.contentType};base64,${data}`;
      const a = document.createElement('a');

      a.href = fetchHref;
      a.download = `${report.name}_${this.osiModule.osiInfo.name}_${period.begin.substring(
        0,
        10
      )}_${period.end.substring(0, 10)}.${report.ext}`;

      a.click();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  }
}
