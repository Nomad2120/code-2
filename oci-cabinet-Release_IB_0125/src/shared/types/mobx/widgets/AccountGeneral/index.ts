export interface IAccountGeneralWidgetViewModel {
  user: any;
  onSubmit: (values: any, formikState: any) => Promise<void>;
  isLoading: boolean;
}

export const IAccountGeneralWidgetViewModelToken = Symbol.for('IAccountGeneralWidgetViewModel');
