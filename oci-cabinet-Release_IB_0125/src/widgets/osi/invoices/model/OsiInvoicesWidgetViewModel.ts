import { makeAutoObservable } from 'mobx';
import { IOsiInvoicesWidgetViewModel } from '@shared/types/mobx/widgets/OsiInvoicesWidget';
import { injectable } from 'inversify';
import api from '@app/api';
import fileDownload from 'js-file-download';
import { OsiModule } from '@mobx/services/osiModule';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';
import { PlanAccural } from '@shared/types/osi/accurals';
import { getLastPlanOrCreateNew } from '@shared/api/osi/accruals';

@injectable()
export class OsiInvoicesWidgetViewModel implements IOsiInvoicesWidgetViewModel {
  isLoading = false;

  isPartialTableShown = false;

  planAccural: PlanAccural | null = null;

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);

    this.loadPlanAccural();
  }

  get isInvoicesEnabled() {
    return Boolean(this.planAccural?.accuralCompleted);
  }

  get invoicesBeginDay() {
    return this.planAccural?.accuralJobAtDay ?? 5;
  }

  openPartialTable = () => {
    this.isPartialTableShown = true;
  };

  closePartialTable = () => {
    this.isPartialTableShown = false;
  };

  downloadInvoices = async () => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');

      this.isLoading = true;
      const data = await api.getInvoicesPdf(this.osiModule.osiId);
      // @ts-expect-error api not typed
      fileDownload(data, `квитанции_${new Date().toISOString()}.pdf`);
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

  private loadPlanAccural = async () => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');

      this.planAccural = await getLastPlanOrCreateNew(this.osiModule.osiId);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };
}
