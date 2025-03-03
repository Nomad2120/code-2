import React from 'react';
import { RegistrationFormEditViewModel } from '@entities/registration/RegistrationForm/Edit/model/viewModel';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import LoadingScreen from '@shared/components/LoadingScreen';
import { Form } from '@entities/registration/RegistrationForm/Edit/ui/Form';

export const RegistrationFormEdit: React.FC = observer(() => {
  const vm = useInjection(RegistrationFormEditViewModel);

  return vm.isLoading ? <LoadingScreen /> : <Form vm={vm} />;
});
