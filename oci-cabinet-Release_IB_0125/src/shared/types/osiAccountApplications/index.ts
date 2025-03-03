import { OsiAccountTypes } from '@shared/types/osi/accounts';
import { DocTypeCodes } from '@shared/types/dictionaries';

export interface OsiAccountApplication {
  applicationType?: ApplicationTypes | null;
  /** @format int32 */
  osiId: number;
  /** @format int32 */
  osiAccountId?: number | null;
  type: OsiAccountTypes;
  bic: string;
  /** @maxLength 20 */
  account: string;
  /** @format int32 */
  serviceGroupId?: number | null;
  /** @format int32 */
  id?: number;
  /** @format date-time */
  createDt?: string;
  state?: string | null;
  rejectReason?: string | null;
  oldBankBic?: string | null;
  oldAccount?: string | null;
  applicationTypeText?: string | null;
  stateText?: string | null;
  bankName?: string | null;
  accountTypeNameRu?: string | null;
  accountTypeNameKz?: string | null;
}

export interface OsiAccountApplicationDoc {
  /** @format int32 */
  id?: number;
  docTypeCode?: string | null;
  docTypeNameRu?: string | null;
  docTypeNameKz?: string | null;
  scan: Scan;
}

export interface OsiAccountApplicationDocFile extends OsiAccountApplicationDoc {
  file: File;
  preview: string;
  base64Data: string;
  extension: string;
  fileName: string;
}

export interface AddScanDoc {
  docTypeCode: DocTypeCodes | string;
  /** @format byte */
  data: string;
  extension?: string | null;
}

export interface Scan {
  /** @format int32 */
  id?: number;
  /** @maxLength 100 */
  fileName: string;
}

export interface OsiAccountApplicationCheckRequest {
  applicationType?: ApplicationTypes | null;
  /** @format int32 */
  osiId: number;
  /** @format int32 */
  osiAccountId?: number | null;
  type: OsiAccountTypes;
  /** @format int32 */
  serviceGroupId?: number | null;
}

export interface OsiAccountApplicationRequest {
  applicationType?: ApplicationTypes | null;
  /** @format int32 */
  osiId: number;
  /** @format int32 */
  osiAccountId?: number | null;
  type: OsiAccountTypes;
  bic: string;
  /** @maxLength 20 */
  account: string;
  /** @format int32 */
  serviceGroupId?: number | null;
}

export interface OsiAccountApplicationRequestWithFile extends OsiAccountApplicationRequest {
  docs: any[];
}

export enum AccountTypeCodes {
  CURRENT = 'CURRENT',
  SAVINGS = 'SAVINGS'
}

export interface ApiResponse {
  /** @format int32 */
  code?: number;
  message?: string | null;
}

export enum ApplicationTypes {
  'UPDATE' = 'UPDATE',
  'ADD' = 'ADD'
}
