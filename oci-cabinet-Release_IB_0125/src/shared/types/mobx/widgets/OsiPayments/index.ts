export interface IOsiPaymentsWidgetViewModel {
  isLoading: boolean;
  payments: any;
  dateBegin: any;
  dateEnd: any;
  period: any;

  rows: any;

  loadPayments: () => Promise<void>;
  downloadReport: () => Promise<void>;
}

export const IOsiPaymentsWidgetViewModelToken = Symbol.for('IOsiPaymentsWidgetViewModel');
