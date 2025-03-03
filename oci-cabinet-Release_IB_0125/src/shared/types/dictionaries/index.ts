export interface AccuralMethods {
  /** @format int32 */
  id: number;
  descriptionRu?: string | null;
  descriptionKz?: string | null;
}

export interface AreaType {
  code?: AreaTypeCodes;
  /** @maxLength 100 */
  nameRu?: string | null;
  /** @maxLength 100 */
  nameKz?: string | null;
}

export enum AreaTypeCodes {
  RESIDENTIAL = 'RESIDENTIAL',
  NON_RESIDENTIAL = 'NON_RESIDENTIAL',
  BASEMENT = 'BASEMENT'
}

export interface AccountType {
  code?: AccountTypeCodes;
  /** @maxLength 100 */
  nameRu?: string | null;
  /** @maxLength 100 */
  nameKz?: string | null;
}

export enum AccountTypeCodes {
  CURRENT = 'CURRENT',
  SAVINGS = 'SAVINGS'
}

export interface Bank {
  /** @maxLength 10 */
  bic?: string | null;
  /** @maxLength 200 */
  name?: string | null;
  /** @maxLength 10 */
  identifier?: string | null;
}

export interface DocType {
  code?: DocTypeCodes;
  /** @maxLength 100 */
  nameRu: string;
  /** @maxLength 100 */
  nameKz?: string | null;
  /** @format int32 */
  maxSize: number;
}

export enum DocTypeCodes {
  UDL = 'UDL',
  REGISTRATION = 'REGISTRATION',
  SPR_REG_OSI = 'SPR_REG_OSI',
  SIGNED_CONTRACT = 'SIGNED_CONTRACT',
  TECHPASSPORT1LIST = 'TECHPASSPORT_1LIST',
  SIGNED_ACT = 'SIGNED_ACT',
  ACCOUNT_REPORT_MONTHLY = 'ACCOUNT_REPORT_MONTHLY'
}

export interface HouseState {
  code?: HouseStateCodes;
  /** @maxLength 50 */
  nameRu?: string | null;
  /** @maxLength 50 */
  nameKz?: string | null;
}

export enum HouseStateCodes {
  NORMAL = 'NORMAL',
  DECREPIT = 'DECREPIT',
  EMERGENCY = 'EMERGENCY'
}

export interface Knp {
  code?: string | null;
  /** @maxLength 200 */
  nameRu?: string | null;
  /** @maxLength 200 */
  nameKz?: string | null;
}

export interface ServiceCompany {
  code?: ServiceCompanyCodes;
  /** @maxLength 200 */
  nameRu?: string | null;
  /** @maxLength 200 */
  nameKz?: string | null;
}

export enum ServiceCompanyCodes {
  ELECTRIC = 'ELECTRIC',
  GAZMAN = 'GAZMAN',
  LIFTER = 'LIFTER',
  PLUMBER = 'PLUMBER',
  DISPATCHER = 'DISPATCHER',
  BOILERMAKER = 'BOILERMAKER',
  DISTRICT_INSPECTOR = 'DISTRICT_INSPECTOR'
}

export interface ServiceGroup {
  /** @format int32 */
  id?: number;
  nameRu?: string | null;
  nameKz?: string | null;
  accountTypeCode?: ServiceGroupCodes;
  code?: string | null;
  canChangeName?: boolean;
  justOne?: boolean;
  copyToNextPeriod?: boolean;
  canEditAbonents?: boolean;
  canCreateFixes?: boolean;
  accountTypeNameRu?: string | null;
  accountTypeNameKz?: string | null;
}

export enum ServiceGroupCodes {
  CURRENT = 'CURRENT',
  SAVINGS = 'SAVINGS'
}

export interface UnionType {
  /** @format int32 */
  id?: number;
  nameRu?: string | null;
  /** @maxLength 100 */
  nameKz?: string | null;
}
