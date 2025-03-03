import { CORE_PATH } from '@shared/api/paths';
import { instance } from '@shared/api/config';

const MAIN_PATH = 'PlanAccurals';

export const path = `${CORE_PATH}/${MAIN_PATH}`;

export const setAccuralJobAtDay = (planId: number, newDate: number): Promise<void> =>
  instance.put(`${path}/${planId}/set-accural-job-at-day?accuralDay=${newDate}`, {});
