import { ServiceGroupResponse } from '@shared/types/osi/services';

export interface IOsiAccrualsWidgetViewModel {
  isLoading: boolean;
  serviceGroups: ServiceGroupResponse[];
  reloadServiceGroups: () => Promise<void>;
  isCanRemakeAccruals: boolean;
}

export const token = Symbol.for('IOsiAccrualsWidgetViewModel');
