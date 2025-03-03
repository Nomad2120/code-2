import { RegistrationViewModel } from '@widgets/registration/model';
import { Box, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { StepCodes, steps } from '@widgets/registration/config/steps';

export const RegistrationButtons: React.FC = observer(() => {
  const vm = useInjection(RegistrationViewModel);
  const { translateToken: tt } = useTranslation();

  const renderPrevButton = () => {
    if (vm.prevStepAllowed) return <LoadingButton onClick={vm.prevStep}>{tt(tokens.common.back)}</LoadingButton>;
    return null;
  };

  const renderNextButton = () => {
    if (vm.isFinishStep) {
      return (
        <LoadingButton disabled={!vm.isFinishAllowed} onClick={vm.exit}>
          {tt(tokens.common.finish)}
        </LoadingButton>
      );
    }

    const isAccountsStep = steps?.[vm.currentStep].code === StepCodes.accounts;

    if (isAccountsStep) {
      return renderNextButtonForAccountsWidget();
    }

    return (
      <LoadingButton variant="contained" disabled={!vm.nextStepAllowed} loading={vm.isLoading} onClick={vm.nextStep}>
        {tt(tokens.common.next)}
      </LoadingButton>
    );
  };

  const renderNextButtonForAccountsWidget = () => {
    const title = vm.nextStepAllowed ? '' : 'Вы заполнили не все счета!';

    return (
      <Tooltip title={title}>
        <span>
          <LoadingButton
            variant="contained"
            disabled={!vm.nextStepAllowed}
            loading={vm.isLoading}
            onClick={vm.nextStep}
          >
            {tt(tokens.common.next)}
          </LoadingButton>
        </span>
      </Tooltip>
    );
  };

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
