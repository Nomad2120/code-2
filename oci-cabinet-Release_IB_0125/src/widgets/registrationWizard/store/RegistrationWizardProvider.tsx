import { createContext, useContext } from 'react';
import { RegistrationWizardViewModel } from '@widgets/registrationWizard/store/RegistrationWizardViewModel';

const RegistrationWizardContext = createContext<RegistrationWizardViewModel | null>(null);

interface Props {
  registrationWizardViewModel: any;
  children: React.ReactNode;
}

export const RegistrationWizardProvider: React.FC<Props> = ({ registrationWizardViewModel, children }) => (
  <RegistrationWizardContext.Provider value={registrationWizardViewModel}>
    {children}
  </RegistrationWizardContext.Provider>
);

export const useRegistrationWizardContext = () => {
  const context = useContext(RegistrationWizardContext);
  if (context === undefined) {
    throw new Error('useRegistrationWizardContext must be used within a RegistrationWizardProvider');
  }
  return context!;
};
