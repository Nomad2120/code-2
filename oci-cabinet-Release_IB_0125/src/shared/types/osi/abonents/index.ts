import { AreaType } from '@shared/types/dictionaries';

export interface Abonent {
  /** @format int32 */
  osiId?: number;
  /** @maxLength 100 */
  name?: string | null;
  /** @maxLength 200 */
  flat: string;
  idn?: string | null;
  areaTypeCode: AreaType;
  /**
   * @maxLength 15
   * @pattern ^7\d{9}$
   */
  phone?: string | null;
  /** @format int32 */
  floor: number;
  /** @format double */
  square: number;
  /** @format int32 */
  livingJur: number;
  /** @format int32 */
  livingFact: number;
  owner?: null | { nameRu: string; nameKz: string };
  external?: boolean;
  /** @format double */
  effectiveSquare?: number | null;
  /** @format int32 */
  id?: number;
  isActive?: boolean;
  /** @maxLength 20 */
  ercAccount?: string | null;
  areaTypeNameRu?: string | null;
  areaTypeNameKz?: string | null;
  osiName?: string | null;
  address?: string | null;
  invoiceNum?: string | null;
}

export interface ArendatorRequest {
  /** @format int32 */
  osiId?: number;
  name?: string | null;
  address?: string | null;
  rca?: string | null;
  phone?: string | null;
  idn?: string | null;
  flat?: string | null;
}

export interface Arendator {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  abonentId?: number;
  address?: string | null;
  rca: string;
}

export interface AbonentRequest {
  /** @format int32 */
  osiId?: number;
  /** @maxLength 100 */
  name?: string | null;
  /** @maxLength 200 */
  flat: string;
  idn?: string | null;
  areaTypeCode: AreaType;
  /**
   * @maxLength 15
   * @pattern ^7\d{9}$
   */
  phone?: string | null;
  /** @format int32 */
  floor: number;
  /** @format double */
  square: number;
  /** @format int32 */
  livingJur: number;
  /** @format int32 */
  livingFact: number;
  owner?: string | null;
  external?: boolean;
  /** @format double */
  effectiveSquare?: number | null;
}

export interface ApiResponse {
  /** @format int32 */
  code?: number;
  message?: string | null;
}
