export interface IOsiCorrectionWidgetViewModel {
  isLoading: boolean;
  fixes: any;
  period: any;
  date: any;

  downloadReport: () => Promise<void>;
  loadFixes: () => Promise<void>;

  rows: any;
}

export const IOsiCorrectionWidgetViewModelToken = Symbol.for('OsiCorrectionWidgetViewModel');
