export interface IOsiDebtsWidgetViewModel {
  debts: any[];
  isLoading: boolean;
  refreshDebts: () => Promise<void>;
}

export const IOsiDebtsWidgetViewModelToken = Symbol.for('IOsiDebtsWidgetViewModel');
