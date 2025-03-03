export interface IAccountChangePasswordWidgetViewModel {
  changePassword: (values: any) => Promise<void>;
  isLoading: boolean;
}

export const IAccountChangePasswordWidgetViewModelToken = Symbol.for('IAccountChangePasswordWidgetViewModel');
