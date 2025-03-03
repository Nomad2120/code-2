import { AccountReport, AccountReportList } from '@shared/types/osi/accountReports';

export enum ViewMode {
  Entry,
  Select_account,
  Assign_list,
  Editing
}

export interface ReportDialog {
  isOpen: boolean;
  viewMode: ViewMode;
  selectedReport: AccountReport | null;
  selectedAccount: AccountReportList | null;
  editorFilters: FilterModel;
  hookForm: any;
  isReadonly: boolean;
}

export interface FilterModel {
  checked: boolean;
  filterModel: {
    items: any[];
  };
}
