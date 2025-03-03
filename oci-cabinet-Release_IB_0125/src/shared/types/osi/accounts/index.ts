export interface AccountForm {
  account: string;
  accountType: string;
  bank: {
    bic: string;
    name: string;
  };
}

export interface AccountFormWithFile extends AccountForm {
  file: File;
}

export interface OsiAccountRequest {
  /** @format int32 */
  osiId: number;
  type: OsiAccountTypes;
  bic: string;
  /** @maxLength 20 */
  account: string;
  /** @format int32 */
  serviceGroupId?: number | null;
}

export enum OsiAccountTypes {
  CURRENT = 'CURRENT',
  SAVINGS = 'SAVINGS'
}
