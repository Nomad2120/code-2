import { AccountTypeCodes } from '@shared/types/dictionaries';
import { ReqDocCodes } from '@mobx/interfaces';

export interface RegistrationAccount {
  /** @format int32 */
  registrationId: number;
  type: AccountTypeCodes;
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

export interface RegistrationAccountRequest {
  registrationId: number;
  type: AccountTypeCodes;
  bic: string;
  /** @maxLength 20 */
  account: string;
  /** @format int32 */
  serviceGroupId?: number | null;
}

export interface RequiredDocsResponse {
  code?: DocTypeCodes | ReqDocCodes;
  nameRu?: string;
  nameKz?: string;
  maxSize: number;
  isRequired: boolean;
}

export interface RegistrationDoc {
  id: number;
  docTypeCode: DocTypeCodes;
  docTypeNameRu: string;
  docTypeNameKz: string;
  scan: DocScan;
}

export interface RegistrationDocFile extends RegistrationDoc {
  file: File;
  preview: string;
  fileName: string;
  base64data: string;
  extension: string;
}

export enum DocTypeCodes {
  UDL = 'UDL',
  REGISTRATION = 'REGISTRATION',
  SPR_REG_OSI = 'SPR_REG_OSI',
  SIGNED_CONTRACT = 'SIGNED_CONTRACT',
  TECHPASSPORT_1LIST = 'TECHPASSPORT_1LIST',
  SIGNED_ACT = 'SIGNED_ACT',
  SAVING_IBAN_INFO = 'SAVING_IBAN_INFO',
  CURRENT_IBAN_INFO = 'CURRENT_IBAN_INFO'
}

export interface DocScan {
  id: number;
  fileName: string;
}

export interface Registration {
  /** @maxLength 100 */
  name: string;
  /** @maxLength 12 */
  idn: string;
  /** @maxLength 100 */
  address: string;
  /** @format int32 */
  userId: number;
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
   * @min 1
   * @max 999
   */
  apartCount: number;
  stateCode: OSICoreModelsEnumsRegistrationStateCodes;
  /** @maxLength 100 */
  fio?: string | null;
  /** @format int32 */
  addressRegistryId?: number | null;
  /** @maxLength 16 */
  rca?: string | null;
  /** @format int32 */
  atsId?: number | null;
  /** @format int32 */
  unionTypeId?: number;
  registrationType?: string | null;
  /** @format int32 */
  id?: number;
  stateName?: string | null;
  /** @format date-time */
  createDt?: string;
  /** @format double */
  tariff?: number;
  /** @format date-time */
  signDt?: string | null;
  /** @maxLength 20 */
  wizardStep?: string | null;
  unionTypeRu?: string | null;
  unionTypeKz?: string | null;
  registrationKind?: RegistrationKinds;
}

export enum OSICoreModelsEnumsRegistrationStateCodes {
  CREATED = 'CREATED',
  SIGNED = 'SIGNED',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  CLOSED = 'CLOSED'
}

export enum RegistrationKinds {
  INITIAL = 'INITIAL',
  CHANGE_CHAIRMAN = 'CHANGE_CHAIRMAN',
  CHANGE_UNION_TYPE = 'CHANGE_UNION_TYPE'
}
