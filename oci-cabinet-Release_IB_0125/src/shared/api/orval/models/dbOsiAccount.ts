/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * OSI.Core
 * OpenAPI spec version: v1
 */
import type { EnumsAccountTypeCodes } from './enumsAccountTypeCodes';

export interface DbOsiAccount {
  /** @maxLength 20 */
  account: string;
  /** @nullable */
  readonly accountTypeNameKz?: string | null;
  /** @nullable */
  readonly accountTypeNameRu?: string | null;
  /** @nullable */
  readonly bankName?: string | null;
  bic: string;
  id?: number;
  osiId: number;
  /** @nullable */
  serviceGroupId?: number | null;
  type: EnumsAccountTypeCodes;
}
