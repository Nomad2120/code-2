import { makeAutoObservable } from 'mobx';
import api from '@app/api';
import fileDownload from 'js-file-download';
import notistack from '@shared/utils/helpers/notistackExternal';
import { AppartmentsModule } from '@mobx/services/appartments';
import { injectable } from 'inversify';
import { ProfileModule } from '@mobx/services/profile';

@injectable()
export class InvoicesWidgetViewModel {
  isLoading = false;

  constructor(private appartmentModule: AppartmentsModule, private profileModule: ProfileModule) {
    makeAutoObservable(this);
  }

  createInvoices = async (): Promise<void> => {
    this.isLoading = true;
    try {
      const abonentIds = this.profileModule.userData.appartments
        .filter((appart) => appart.osiId === this.appartmentModule.osi.id)
        .map((appart) => appart.abonentId);

      const data = (await api.getPartialInvoices(abonentIds)) as any;
      fileDownload(data, `квитанция_${new Date().toISOString()}.pdf`);
    } catch (error: any) {
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
      notistack.error(`Ошибка при получении квитанции. ${message}`);
    } finally {
      this.isLoading = false;
    }
  };
}
