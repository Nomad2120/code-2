export interface PastDebtsByOsiResponse {
  /** @format int32 */
  abonentId?: number;
  abonentName?: string | null;
  flat?: string | null;
  serviceGroups?: PastDebtsByOsiResponseItem[] | null;
}

export interface PastDebtsByOsiResponseItem {
  /** @format int32 */
  serviceGroupId?: number;
  serviceGroupNameRu?: string | null;
  serviceGroupNameKz?: string | null;
  pastDebts?: PastDebtInfo[] | null;
}

export interface PastDebtsResponse {
  /** @format double */
  saldo?: number;
  pastDebts?: PastDebtInfo[] | null;
}

export interface PastDebtInfo {
  /** @format date-time */
  period: string;
  /** @format double */
  amount: number;
}
