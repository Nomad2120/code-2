export interface Act {
  id: number;
  createDt: string;
  signDt?: string;
  actPeriod: string;
  actNum: string;
  stateCode: ActStateCodes;
  stateName?: string;
  osiId: number;
  osiName?: string;
  osiIdn?: string;
  osiAddress?: string;
  osiPhone?: string;
  osiRegistrationDate?: string;
  apartCount?: number;
  planAccuralId: number;
  amount: number;
  comission: number;
  debt: number;
  tariff: number;
  actDateStr?: string;
}

export enum ActStateCodes {
  CREATED = 'CREATED',
  SIGNED = 'SIGNED',
  PROV = 'PROV'
}

export interface ActDoc {
  id: number;
  docTypeCode: DocTypeCodes;
  docTypeNameRu?: string;
  docTypeNameKz?: string;
  scan: Scan;
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

export interface Scan {
  id: number;
  fileName: string;
}
