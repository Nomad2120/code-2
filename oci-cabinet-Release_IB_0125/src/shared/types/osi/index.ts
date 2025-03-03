import { DocTypeCodes, HouseStateCodes } from '@shared/types/dictionaries';
import { OSICoreModelsEnumsAccountTypeCodes } from '@shared/api/swaggerTypes/data-contracts';

export interface Osi {
  /** @maxLength 100 */
  name: string;
  /** @maxLength 12 */
  idn: string;
  /** @maxLength 100 */
  address: string;
  /**
   * @maxLength 15
   * @pattern ^7\d{9}$
   */
  phone: string;
  /**
   * @maxLength 100
   * @pattern ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$
   */
  email?: string | null;
  /**
   * @format int32
   * @min 1800
   * @max 99999999999
   */
  constructionYear?: number | null;
  /** @maxLength 50 */
  constructionMaterial?: string | null;
  /**
   * @format int32
   * @min 1
   * @max 100
   */
  floors?: number | null;
  /** @format int32 */
  apartCount?: number | null;
  houseStateCode: HouseStateCodes;
  personalHeating?: boolean | null;
  personalHotWater?: boolean | null;
  personalElectricPower?: boolean | null;
  gasified?: boolean | null;
  /**
   * @format int32
   * @min 100
   * @max 300
   */
  coefUnlivingArea: number;
  /** @maxLength 100 */
  fio?: string | null;
  /** @format int32 */
  unionTypeId: number;
  createFine?: boolean;
  /** @format int32 */
  id?: number;
  isActive: boolean;
  isLaunched: boolean;
  /** @format int32 */
  registrationId: number;
  registrationType?: string | null;
  /** @maxLength 100 */
  wizardStep?: string | null;
  /** @maxLength 16 */
  rca?: string | null;
  houseStateNameRu?: string | null;
  houseStateNameKz?: string | null;
  takeComission?: boolean;
  isInPromo?: boolean;
  /** @format int32 */
  freeMonthPromo?: number;
  accuralsWithDecimals?: boolean;
  /**
   * @minLength 2
   * @maxLength 2
   */
  kbe: string;
  unionTypeRu?: string | null;
  unionTypeKz?: string | null;
  canRemakeAccurals?: boolean;
}

export interface OsiDoc {
  /** @format int32 */
  id?: number;
  docTypeCode?: DocTypeCodes;
  docTypeNameRu?: string | null;
  docTypeNameKz?: string | null;
  scan?: Scan;
  /** @format date-time */
  createDt?: string | null;
}

export interface Scan {
  /** @format int32 */
  id?: number;
  /** @maxLength 100 */
  fileName: string;
}

export interface Facility {
  value: string;
  label: string;
  labelToken: string;
}

export interface OsiInfoValues {
  name: string;
  fio: string;
  idn: string;
  phone: string;
  email: string;
  houseStateCode: string;
  floors: string;
  wreckage: boolean;
  personalHeating: boolean;
  personalHotWater: boolean;
  personalElectricPower: boolean;
  gasified: boolean;
  registrationType: 'FREE' | 'FULL';
}

export interface Material {
  code: string;
  labelRu: string;
  labelKz: string;
}

export interface OsiAccount {
  /** @format int32 */
  osiId: number;
  type: OsiAccountTypes;
  bic: string;
  /** @maxLength 20 */
  account: string;
  /** @format int32 */
  serviceGroupId?: number | null;
  /** @format int32 */
  id?: number;
  bankName?: string | null;
  accountTypeNameRu?: string | null;
  accountTypeNameKz?: string | null;
}

export enum OsiAccountTypes {
  CURRENT = 'CURRENT',
  SAVINGS = 'SAVINGS'
}
