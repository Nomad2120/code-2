/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * OSI.Core
 * OpenAPI spec version: v1
 */
import type { EnumsAccountTypeCodes } from './enumsAccountTypeCodes';

export interface RequestsOsiAccountRequest {
  /** @maxLength 20 */
  account: string;
  bic: string;
  osiId: number;
  /** @nullable */
  serviceGroupId?: number | null;
  type: EnumsAccountTypeCodes;
}
