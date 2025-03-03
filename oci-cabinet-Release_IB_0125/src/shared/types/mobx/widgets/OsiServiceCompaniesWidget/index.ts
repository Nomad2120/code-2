import { OsiServiceCompany } from '@shared/types/osi/osiServiceCompanies';

export interface OsiServiceCompaniesWidgetViewModel {
  serviceCompanies: OsiServiceCompany[];
  loadServiceCompanies: () => void;
  isLoading: boolean;
}

export const token = Symbol.for('OsiServiceCompaniesWidgetViewModel');
