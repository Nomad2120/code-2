export type AccountReportState = 'CREATED' | 'FILLED' | 'PUBLISHED';
export type AccountTypes = 'CURRENT' | 'SAVINGS';
export type OperationTypes = 'DEBET' | 'KREDIT';

export interface AccountReport {
  id: number;
  osiId: number;
  state: AccountReportState;
  period: string;
  lists?: AccountReportList[];
  docs?: AccountReportDoc[];
}

export interface AccountReportList {
  id: number;
  account?: string;
  accountType: AccountTypes;
  accountTypeNameRu?: string;
  accountTypeNameKz?: string;
  isFilled: boolean;
  isInPublishedReport: boolean;
  bic?: string;
  bankName?: string;
  bankStatementVideoUrl?: string;
  begin: number;
  debet: number;
  kredit: number;
  end: number;
  items?: AccountReportListItem[];
}

export interface AccountReportDoc {
  id: number;
  docTypeCode: string;
  docTypeNameRu: string;
  docTypeNameKz: string;
  scan: Scan;
}

export interface Scan {
  id: number;
  fileName: string;
}

export interface AccountReportListItem {
  id: number;
  dt: string;
  amount: number;
  receiver?: string;
  bin?: string;
  assign?: string;
  operationType: OperationTypes;
  operationTypeNameRu: string;
  operationTypeNameKz: string;
  categoryId?: number | null | string | undefined;
  details?: AccountReportListItemDetail[];
  filled?: string;
}

export interface AccountReportListItemDetail {
  id: number;
  amount: number;
  comment?: string;
  categoryId?: number | null | string | undefined;
}

export interface AccountReportLastMonth extends Omit<AccountReport, 'osiId' | 'lists'> {
  lists?: AccountListLastMonth[];
}

export interface AccountListLastMonth extends Omit<AccountReportList, 'begin' | 'debet' | 'kredit' | 'end' | 'items'> {
  isFilled: boolean;
}

export interface AccountReportCategory {
  id: number;
  number?: string;
  nameRu?: string;
  nameKz?: string;
  accountType: AccountTypes;
  accountTypeNameRu?: string;
  accountTypeNameKz?: string;
  operationType: OperationTypes;
  operationTypeNameRu?: string;
  operationTypeNameKz?: string;
}
