import { instance } from '@shared/api/config';
import { AccountReportCategory } from '@shared/types/osi/accountReports';
import { CORE_PATH } from '@shared/api/paths';

const MAIN_PATH = 'AccountReports';

export const getAccountReportsCategories = async (): Promise<AccountReportCategory[]> =>
  instance.get(`${CORE_PATH}/${MAIN_PATH}/categories`);
