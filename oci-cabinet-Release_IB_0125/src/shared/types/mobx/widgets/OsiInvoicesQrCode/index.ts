export interface IQrCodeInvoicesWidgetViewModel {
  isLoading: boolean;
  pdf: any;
  tgLink: string;
  printQrCode: () => void;
  downloadQrCode: () => void;
  qrCodeInfoVideoLink: string;
}

export const IQrCodeInvoicesWidgetViewModelToken = Symbol.for('IQrCodeInvoicesWidgetViewModel');
