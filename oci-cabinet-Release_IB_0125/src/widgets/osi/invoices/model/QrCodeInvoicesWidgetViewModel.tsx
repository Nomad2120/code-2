import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { IQrCodeInvoicesWidgetViewModel } from '@shared/types/mobx/widgets/OsiInvoicesQrCode';
import { OsiModule } from '@mobx/services/osiModule';
import api from '@app/api';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';

@injectable()
export class QrCodeInvoicesWidgetViewModel implements IQrCodeInvoicesWidgetViewModel {
  qrCodeInfoVideoLink = 'https://www.youtube.com/shorts/pAgT4YRZQzQ';

  isLoading = false;

  pdf: any = null;

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);
    this.loadQrCodePdf();
  }

  get tgLink() {
    return `https://t.me/OSISubscriptionBot?start=${this.osiModule.osiId}`;
  }

  printQrCode = async () => {
    const blob = new Blob([Uint8Array.from(atob(this.pdf), (c) => c.charCodeAt(0))], { type: 'application/pdf' });
    window.open(URL.createObjectURL(blob));
  };

  downloadQrCode = async () => {
    const a = document.createElement('a');
    a.href = `data:application/pdf;base64,${this.pdf}`;
    a.download = 'QRCode.pdf';
    a.click();
  };

  private loadQrCodePdf = async () => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');

      this.isLoading = true;
      // @ts-expect-error api not typed
      const { pdfBase64 } = await api.getQRInvoicePDF(this.osiModule.osiId);
      this.pdf = pdfBase64;
    } catch (e) {
      logger.error(e);
      notistackExternal.error('Ошибка');
    } finally {
      this.isLoading = false;
    }
  };
}
