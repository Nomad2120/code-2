import { observer } from 'mobx-react-lite';
import { useRegistrationWizardContext } from '@widgets/registrationWizard/store/RegistrationWizardProvider';
import { LoadingButton } from '@mui/lab';
import { Tooltip } from '@mui/material';
import LoadingScreen from '@shared/components/LoadingScreen';
import { useRegistrationAccounts } from '@widgets/registrationWizard/hooks/RegistrationAccounts/useRegistrationAccounts';
import { useTranslation } from '@shared/utils/i18n';
import { WizardButtonsWrapper } from '@widgets/registrationWizard/ui/WizardButtonsWrapper';

export const WizardButtons: React.FC = observer(() => {
  const wizard = useRegistrationWizardContext();
  const { isLoading, isAllAccountsFilled } = useRegistrationAccounts();
  const { t } = useTranslation();

  if (isLoading) return <LoadingScreen />;

  const { wizardStep } = wizard;

  return (
    <WizardButtonsWrapper>
      {wizardStep !== 0 && <LoadingButton onClick={wizard.prevStep}>{t('common:back')}</LoadingButton>}
      <Tooltip title={isAllAccountsFilled() ? '' : t('registration:notAllRegistrationAccountsFilled')}>
        <span>
          <LoadingButton variant={'contained'} disabled={!isAllAccountsFilled()} onClick={wizard.nextStep}>
            {t('common:next')}
          </LoadingButton>
        </span>
      </Tooltip>
    </WizardButtonsWrapper>
  );
});
