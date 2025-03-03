import { instance } from '@shared/api/config';
import { PlanAccural } from '@shared/types/osi/accurals';
import { path } from '../index';

export const getLastPlanOrCreateNew = (osiId: number): Promise<PlanAccural> =>
  instance.get(`${path}/${osiId}/get-last-plan-or-create-new`);
