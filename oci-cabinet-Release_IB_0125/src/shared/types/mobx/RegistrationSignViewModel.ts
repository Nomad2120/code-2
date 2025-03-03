import { RegistrationWizardViewModel } from '@widgets/registrationWizard/store/RegistrationWizardViewModel';

export interface IRegistrationSignViewModel {
  isLoading: boolean;
  elements: { docHtml: any; docPdf: any };
  wizard: RegistrationWizardViewModel | null;

  createContract(): Promise<void>;

  saveContract(data: any): Promise<void>;
}

export const token = Symbol.for('IRegistrationSignViewModel');
