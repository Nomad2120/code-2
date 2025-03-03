import { CORE_PATH } from '@shared/api/paths';
import { instance } from '@shared/api/config';
import { OsiServiceCompany, OsiServiceCompanyRequest } from '@shared/types/osi/osiServiceCompanies';

export const MAIN_PATH = 'OsiServiceCompanies';

export const path = `${CORE_PATH}/${MAIN_PATH}`;

export const getOsiServiceCompanyById = (companyId: number): Promise<OsiServiceCompany> =>
  instance.get(`${path}/${companyId}`);
export const updateOsiServiceCompany = (companyId: number, payload: OsiServiceCompanyRequest): Promise<void> =>
  instance.put(`${path}/${companyId}`, payload);

export const createOsiServiceCompany = (payload: OsiServiceCompanyRequest): Promise<OsiServiceCompany> =>
  instance.post(`${path}`, payload);

export const deleteOsiServiceCompany = (companyId: number): Promise<void> => instance.delete(`${path}/${companyId}`);
export const updateServiceCompanyById = (companyId: number, payload: OsiServiceCompanyRequest): Promise<void> =>
  instance.put(`${path}/${companyId}`, payload);
