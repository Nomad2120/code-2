import { AreaTypeCodes } from '@shared/types/dictionaries';

export interface ServiceGroupSaldoResponse {
  /** @format int32 */
  groupId?: number;
  groupName?: string | null;
  items?: ServiceGroupSaldoResponseItem[] | null;
}

export interface ServiceGroupSaldoResponseItem {
  /** @format int32 */
  id?: number;
  abonentName?: string | null;
  areaTypeCode?: AreaTypeCodes;
  flat?: string | null;
  /** @format double */
  saldo?: number;
}
