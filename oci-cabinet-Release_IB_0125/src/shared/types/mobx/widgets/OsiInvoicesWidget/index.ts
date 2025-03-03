export interface IOsiInvoicesWidgetViewModel {
  isLoading: boolean;
  isPartialTableShown: boolean;
  isInvoicesEnabled: boolean;
  openPartialTable: () => void;
  closePartialTable: () => void;
  downloadInvoices: () => Promise<void>;
  invoicesBeginDay: number;
}

export const IOsiInvoicesWidgetViewModelToken = Symbol.for('IOsiInvoicesWidgetViewModel');
