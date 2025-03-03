import { CORE_PATH } from '@shared/api/paths';
import { instance } from '@shared/api/config';
import { OsiServiceCompany } from '@shared/types/osi/osiServiceCompanies';

const MAIN_PATH = 'Osi';

const path = `${CORE_PATH}/${MAIN_PATH}`;

export const getServiceCompaniesByOsiId = (osiId: number): Promise<OsiServiceCompany[]> =>
  instance.get(`${path}/${osiId}/service-companies`);
