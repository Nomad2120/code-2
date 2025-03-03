import { RegistrationKinds, RequiredDocsResponse } from '@shared/types/registration';

export interface AuthData {
  token: string;
  userId: number;
}

export interface UserData {
  id: 0;
  code: string;
  fio: string;
  iin: string;
  phone: string;
  email: string;
  roles: UserRole[];
}

export enum RegistrationStateCode {
  CREATED,
  SIGNED,
  CONFIRMED,
  REJECTED,
  CLOSED,
  PREPARED = 'PREPARED'
}

export enum HouseStateCode {
  NORMAL,
  DECREPIT,
  EMERGENCY
}

export interface Registration {
  name: string;
  idn: string;
  address: string;
  userId: number;
  phone: string;
  email: string;
  apartCount: number;
  stateCode: keyof typeof RegistrationStateCode;
  fio: string;
  addressRegistryId: number;
  rca: string;
  atsId: number;
  unionTypeId: number;
  id: number;
  stateName: string;
  createDt: Date;
  tariff: number;
  signDt: Date;
  unionTypeRu: string;
  unionTypeKz: string;
  registrationType: 'FREE' | 'FULL';
  wizardStep: string | number;
  registrationKind?: RegistrationKinds;
}

export interface OsiData {
  name: string;
  idn: string;
  address: string;
  phone: string;
  email: string;
  constructionYear: number;
  constructionMaterial: string;
  floors: number;
  apartCount: number;
  houseStateCode: keyof typeof HouseStateCode;
  personalHeating: boolean;
  personalHotWater: boolean;
  personalElectricPower: true;
  gasified: boolean;
  coefUnlivingArea: number;
  fio: string;
  unionTypeId: number;
  id: number;
  isActive: boolean;
  isLaunched: boolean;
  registrationId: number;
  wizardStep: string;
  rca: string;
  houseStateNameRu: string;
  houseStateNameKz: string;
  takeComission: boolean;
  notInPromo: boolean;
  isInPromo: boolean;
  freeMonthPromo: number;
  endOfPromo: Date;
  accuralsWithDecimals: boolean;
  kbe: 'st';
  unionTypeRu: string;
  unionTypeKz: string;
}

interface AppartmentAbonent {
  abonentId: number;
  abonentName: string;
  flat: string;
}

export interface AppartmentData {
  osiId: number;
  osiName: string;
  address: string;
  abonents: AppartmentAbonent[];
}

export interface AppartmentParsedData {
  abonentId: number;
  abonentName: string;
  flat: string;
  osiId: number;
  osiName: string;
  address: string;
}

interface UserInfo {
  code: string;
  fio: string;
  iin: string;
  phone: string;
  email: string;
}

export enum UserRoles {
  CHAIRMAN = 'CHAIRMAN',
  ABONENT = 'ABONENT',
  OPERATOR = 'OPERATOR',
  ADMIN = 'ADMIN'
}

export interface UserRole {
  nameRu: string;
  nameKz: string;
  role: keyof typeof UserRoles;
}

export interface User {
  id: number;
  info: UserInfo | any;
  roles: UserRole[];
  osis: OsiData[];
  appartments: AppartmentParsedData[];
  registrations: {
    all: Registration[];
    selected: RegistrationFullData | null;
  };
  currentRole: UserRole;
}

export enum ReqDocCodes {
  UDL,
  REGISTRATION,
  SPR_REG_OSI,
  SIGNED_CONTRACT,
  TECHPASSPORT_1LIST,
  SIGNED_ACT,
  CURRENT_IBAN_INFO = 'CURRENT_IBAN_INFO',
  SAVING_IBAN_INFO = 'SAVING_IBAN_INFO'
}

export enum DocTypeCodes {
  UDL,
  REGISTRATION,
  SPR_REG_OSI,
  SIGNED_CONTRACT,
  TECHPASSPORT_1LIST,
  SIGNED_ACT,
  CURRENT_IBAN_INFO = 'CURRENT_IBAN_INFO',
  SAVING_IBAN_INFO = 'SAVING_IBAN_INFO'
}

export interface ReqDoc {
  code: ReqDocCodes;
  nameRu: string;
  nameKz: string;
  maxSize: number;
}

export interface DocScan {
  id: number;
  fileName: string;
}

export interface RegistrationDoc {
  id: number;
  docTypeCode: DocTypeCodes;
  docTypeNameRu: string;
  docTypeNameKz: string;
  scan: DocScan;
}

export interface RegistrationFullData extends Registration {
  reqDocs: RequiredDocsResponse[];
  docs: RegistrationDoc[];
  arInfo: any;
}
