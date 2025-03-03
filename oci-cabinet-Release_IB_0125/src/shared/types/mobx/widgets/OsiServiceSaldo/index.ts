import { ServiceGroupSaldoResponse } from '@shared/types/osi/saldoByGroups';

export interface IOsiServiceSaldoWidgetViewModel {
  saldoByGroup: ServiceGroupSaldoResponse[];
  isLoading: boolean;
}

export const IOsiServiceSaldoWidgetVmToken = Symbol.for('IOsiServiceSaldoWidgetViewModel');
