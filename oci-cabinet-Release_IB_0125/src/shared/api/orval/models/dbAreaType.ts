/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * OSI.Core
 * OpenAPI spec version: v1
 */
import type { EnumsAreaTypeCodes } from './enumsAreaTypeCodes';

export interface DbAreaType {
  code?: EnumsAreaTypeCodes;
  /**
   * @maxLength 100
   * @nullable
   */
  nameKz?: string | null;
  /**
   * @maxLength 100
   * @nullable
   */
  nameRu?: string | null;
}
