import { Box, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { observer } from 'mobx-react-lite';
import { StepCodes, steps } from '@widgets/registration/config/steps';
import { useRegistrationWizardContext } from '@widgets/registrationWizard/store/RegistrationWizardProvider';

export const RegistrationButtons: React.FC = observer(() => {
  const wizard = useRegistrationWizardContext();
  const { translateToken: tt } = useTranslation();

  if (!wizard) return null;

  const renderPrevButton = () => {
    if (wizard.isPrevStepAllowed)
      return <LoadingButton onClick={wizard.prevStep}>{tt(tokens.common.back)}</LoadingButton>;
    return null;
  };

  const renderNextButton = () => {
    if (wizard.isFinishStep) {
      return (
        <LoadingButton disabled={!wizard.isFinishAllowed} onClick={wizard.finish}>
          {tt(tokens.common.finish)}
        </LoadingButton>
      );
    }

    // const isAccountsStep = steps?.[vm.currentStep].code === StepCodes.accounts;
    //
    // if (isAccountsStep) {
    //   return renderNextButtonForAccountsWidget();
    // }

    return (
      <LoadingButton
        variant="contained"
        disabled={!wizard.isNextStepAllowed}
        loading={wizard.isLoading}
        onClick={wizard.nextStep}
      >
        {tt(tokens.common.next)}
      </LoadingButton>
    );
  };

  // const renderNextButtonForAccountsWidget = () => {
  //   const title = vm.nextStepAllowed ? '' : 'Вы заполнили не все счета!';
  //
  //   return (
  //     <Tooltip title={title}>
  //       <span>
  //         <LoadingButton
  //           variant="contained"
  //           disabled={!vm.nextStepAllowed}
  //           loading={vm.isLoading}
  //           onClick={vm.nextStep}
  //         >
  //           {tt(tokens.common.next)}
  //         </LoadingButton>
  //       </span>
  //     </Tooltip>
  //   );
  // };

  return (
    <Box
      sx={{
        mt: 3,
        display: 'flex',
        justifyContent: 'flex-start'
      }}
    >
      {renderPrevButton()}
      {renderNextButton()}
    </Box>
  );
});
