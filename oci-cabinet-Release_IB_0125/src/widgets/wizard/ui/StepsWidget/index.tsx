import { Box, Button, Paper, Step, StepLabel, Stepper, Tooltip, Typography } from '@mui/material';
import { WizardStepTutorial } from '@entities/wizard/WizardStepTutorial';
import StepContent from '@mui/material/StepContent';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import LoadingScreen from '@shared/components/LoadingScreen';
import { useInjection } from 'inversify-react';
import { lastStep, steps } from '@widgets/wizard/config';
import { StepsWidgetViewModel } from '@widgets/wizard/model/StepsWidgetViewModel';
import { observer } from 'mobx-react-lite';
import { OsiInfoStep } from '@widgets/wizard/ui/OsiInfoStep';
import { OsiAccount } from '@shared/types/osi';
import { Abonent } from '@shared/types/osi/abonents';

export const StepsWidget: React.FC = observer(() => {
  const viewModel = useInjection(StepsWidgetViewModel);
  const { translateToken: tt } = useTranslation();

  const { wizardStep } = viewModel;

  if (wizardStep === 'finish') return null;
  if (viewModel.isLoading) return <LoadingScreen />;
  const activeStep = parseInt(wizardStep, 10);

  steps[0].active = true;
  steps[1].active = true;
  steps[2].active = viewModel.isAllAbonentsFilled;
  steps[3].active = true;
  steps[4].active = true;

  const handleNext = async () => {
    if (activeStep < lastStep) {
      viewModel.nextStep();
    } else {
      await viewModel.finish();
    }
  };

  const handleBack = () => {
    viewModel.prevStep();
  };

  const onChangeAccountsHandler = (accounts: OsiAccount[]) => {
    viewModel.accounts = accounts;
  };

  const onChangeAbonentsHandler = (abonents: Abonent[]) => {
    viewModel.abonents = abonents;
  };

  const renderWithProps = (item: any) => {
    const { code, render } = item;

    if (code === 'accounts') {
      return render({ onChangeAccounts: onChangeAccountsHandler });
    }

    if (code === 'abonents') {
      return render({ onChangeAbonents: onChangeAbonentsHandler });
    }

    if (code === 'accruals') {
      return render({ hideSetDate: true });
    }

    return render({});
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>
            <Typography sx={{ display: 'inline', mr: 2 }}>{tt(steps[0].labelToken)}</Typography>
            {activeStep === 0 && <WizardStepTutorial videoId={steps[0].videoId} labelToken={steps[0].labelToken} />}
          </StepLabel>
          <StepContent>
            <OsiInfoStep onBackClick={handleBack} onNextClick={handleNext} />
          </StepContent>
        </Step>
        {steps.slice(2).map((item, index) => (
          <Step key={item.label + index}>
            <StepLabel>
              <Typography sx={{ display: 'inline', mr: 2 }}>{tt(item.labelToken)}</Typography>
              {item.step === activeStep && <WizardStepTutorial videoId={item.videoId} labelToken={item.labelToken} />}
            </StepLabel>
            <StepContent>
              {renderWithProps(item)}
              <Box sx={{ mb: 2 }}>
                <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                  <TranslatedToken id={tokens.common.back} />
                </Button>
                {activeStep === 1 && (
                  <Tooltip title={!item.active ? tt(tokens.osiWizard.notification) : ''}>
                    <span>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={!item.active}
                      >
                        <TranslatedToken id={tokens.common.next} />
                      </Button>
                    </span>
                  </Tooltip>
                )}
                {activeStep !== 1 && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    disabled={!item.active}
                  >
                    {activeStep === lastStep ? tt(tokens.common.finish) : tt(tokens.common.next)}
                  </Button>
                )}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
        </Paper>
      )}
    </Box>
  );
});
