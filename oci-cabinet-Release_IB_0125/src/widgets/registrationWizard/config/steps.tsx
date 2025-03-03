import { RegistrationInfo } from '@widgets/registrationWizard/ui/RegistrationInfo/RegistrationInfo';
import { RegistrationDocs } from '@widgets/registrationWizard/ui/RegistrationDocs/RegistrationDocs';
import { RegistrationAccounts } from '@widgets/registrationWizard/ui/RegistrationAccounts/RegistrationAccounts';
import { RegistrationSignForm } from '@widgets/registrationWizard/ui/RegistrationSign/RegistrationSignForm';

export const wizardSteps = [
  {
    code: 'info',
    label: 'registration:info',
    Content: <RegistrationInfo />
  },
  {
    code: 'docs',
    label: 'registration:docs',
    Content: <RegistrationDocs />
  },
  {
    code: 'accounts',
    label: 'registration:accounts',
    Content: <RegistrationAccounts />
  },
  {
    code: 'sign',
    label: 'registration:accept',
    Content: <RegistrationSignForm />
  }
];
