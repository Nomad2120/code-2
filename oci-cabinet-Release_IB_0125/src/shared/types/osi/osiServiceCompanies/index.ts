export interface OsiServiceCompanyRequest {
  phones: string;
  addresses?: string | null;
  /** @format int32 */
  osiId: number;
  serviceCompanyCode: ServiceCompanyCodes;
  showPhones?: boolean;
}

export interface OsiServiceCompany {
  phones: string;
  addresses?: string | null;
  /** @format int32 */
  osiId: number;
  serviceCompanyCode: ServiceCompanyCodes;
  /** @format int32 */
  id?: number;
  serviceCompanyNameRu?: string | null;
  serviceCompanyNameKz?: string | null;
  showPhones: boolean;
}

export interface OsiServiceCompanyForm {
  code: ServiceCompanyCodes;
  phones: string;
  addresses: string;
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
