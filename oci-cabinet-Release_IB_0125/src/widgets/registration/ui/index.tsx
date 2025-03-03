import { Box, Container, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { tokens, useTranslation } from '@shared/utils/i18n';
import HeaderBreadcrumbs from '@shared/components/HeaderBreadcrumbs';
import { PATH_CABINET } from '@app/routes/paths';
import { useInjection } from 'inversify-react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { IRegistrationAccountsWidgetViewModelToken } from '@shared/types/mobx/widgets/RegistrationAccounts';
import { RegistrationAccount } from '@shared/types/registration';
import { RegistrationModals } from '@widgets/registration/ui/RegistrationModals';
import { RegistrationViewModel } from '../model';
import { RegistrationButtons } from '@/features/registration/RegistrationButtons';

export const Registration: React.FC = observer(() => {
  const { translateToken: tt } = useTranslation();

  const location = useLocation();

  const vm = useInjection(RegistrationViewModel);

  useEffect(() => {
    if (!location?.state?.regType) return;

    vm.regType = location?.state?.regType;
  }, [location, vm]);

  const onChangeAccountsHandler = (accounts: RegistrationAccount[]) => {
    vm.accounts = accounts;
  };

  const render = (step: any) => {
    const { Content, code } = step;

    if (code === 'accounts')
      return (
        <Content
          viewModelToken={IRegistrationAccountsWidgetViewModelToken}
          onChangeAccounts={onChangeAccountsHandler}
        />
      );

    if (code === 'sign') return <Content onPostSign={vm.onPostSign} />;

    if (code === 'docs') return <Content onDocsUpdated={vm.docsUpdated} />;

    return Content;
  };

  return (
    <Box>
      <Container>
        <HeaderBreadcrumbs
          heading={tt(vm.heading)}
          links={[
            { name: tt(tokens.cabinetRoot.registration.homeLink), href: PATH_CABINET.root },
            { name: tt(vm.heading) }
          ]}
          action={undefined}
          sx={undefined}
        />
        <Stepper activeStep={vm.currentStep} orientation="vertical">
          {vm.getSteps().map((step, index) => (
            <Step key={step.labelToken}>
              <StepLabel>
                <Typography>{tt(step.labelToken)}</Typography>
              </StepLabel>
              <StepContent>
                {render(step)}
                <RegistrationButtons />
              </StepContent>
            </Step>
          ))}
        </Stepper>
        <RegistrationModals />
      </Container>
    </Box>
  );
});
