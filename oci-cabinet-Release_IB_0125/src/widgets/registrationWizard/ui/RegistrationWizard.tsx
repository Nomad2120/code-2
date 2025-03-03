import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '@shared/utils/i18n';
import { PATH_CABINET } from '@app/routes/paths';
import { Box, Container, Step, StepContent, StepLabel, Stepper } from '@mui/material';
import HeaderBreadcrumbs from '@shared/components/HeaderBreadcrumbs';
import { RegistrationModals } from '@widgets/registrationWizard/ui/RegistrationModals/RegistrationModals';
import { RegistrationWizardProvider } from '../store/RegistrationWizardProvider';
import {
  RegistrationWizardViewModel,
  token as IRegistrationWizardViewModelToken
} from '../store/RegistrationWizardViewModel';

export const RegistrationWizard: React.FC = observer(() => {
  const viewModel = useInjection<RegistrationWizardViewModel>(IRegistrationWizardViewModelToken);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useLayoutEffect(() => {
    viewModel.location = location;
  }, [location, viewModel]);

  useEffect(() => {
    viewModel.navigate = navigate;
  }, [navigate, viewModel]);

  const heading = t('registration:heading');
  const links = [{ name: t('common:toHome'), href: PATH_CABINET.root }, { name: t('registration:heading') }];

  return (
    <RegistrationWizardProvider registrationWizardViewModel={viewModel}>
      <Box>
        <Container>
          <HeaderBreadcrumbs heading={heading} links={links} action={undefined} sx={undefined} />
          <Stepper activeStep={viewModel.wizardStep} orientation="vertical">
            {viewModel.wizardSteps.map((step) => (
              <Step key={step.code}>
                <StepLabel>{t(step.label)}</StepLabel>
                <StepContent>{step.Content}</StepContent>
              </Step>
            ))}
          </Stepper>
        </Container>
      </Box>
      <RegistrationModals />
    </RegistrationWizardProvider>
  );
});
