import { useInjection } from 'inversify-react';
import { RegistrationModule } from '@mobx/services/registration';
import { observer } from 'mobx-react-lite';
import { RegistrationFormCreate } from '../Create';
import { RegistrationFormEdit } from '../Edit';

export const RegistrationForm: React.FC = observer(() => {
  const registrationModule = useInjection(RegistrationModule);

  if (registrationModule.selectedRegistration != null) {
    return <RegistrationFormEdit />;
  }

  return <RegistrationFormCreate />;
});
