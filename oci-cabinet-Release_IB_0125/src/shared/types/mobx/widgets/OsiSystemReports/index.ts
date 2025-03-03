export interface IOsiSystemReportsWidgetViewModel {
  reports: any[];
  isLoading: boolean;
  onDownloadReportClick: (report: any) => Promise<void>;
}

export const IOsiSystemReportsWidgetVmToken = Symbol.for('IOsiSystemReportsWidgetViewModel');
