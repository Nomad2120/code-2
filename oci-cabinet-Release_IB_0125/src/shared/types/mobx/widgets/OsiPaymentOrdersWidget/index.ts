export interface IOsiPaymentOrdersWidgetViewModel {
  isLoading: boolean;
  startDate: any;
  endDate: any;
  download: () => Promise<void>;
}

export const IOsiPaymentOrdersWidgetViewModelToken = Symbol.for('IOsiPaymentOrdersWidgetViewModel');
