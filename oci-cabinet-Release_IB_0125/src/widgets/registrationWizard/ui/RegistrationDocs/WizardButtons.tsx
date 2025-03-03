import { observer } from 'mobx-react-lite';
import { useRegistrationWizardContext } from '@widgets/registrationWizard/store/RegistrationWizardProvider';
import { LoadingButton } from '@mui/lab';
import { useRegistrationDocsContext } from '@widgets/registrationWizard/store/RegistrationDocs/RegistrationDocsProvider';
import { useTranslation } from '@shared/utils/i18n';
import { WizardButtonsWrapper } from '@widgets/registrationWizard/ui/WizardButtonsWrapper';

export const WizardButtons: React.FC = observer(() => {
  const wizard = useRegistrationWizardContext();
  const viewModel = useRegistrationDocsContext();
  const { t } = useTranslation();
  const { wizardStep } = wizard;

  return (
    <WizardButtonsWrapper>
      {wizardStep !== 0 && <LoadingButton onClick={wizard.prevStep}>{t('common:back')}</LoadingButton>}
      <LoadingButton variant={'contained'} disabled={!viewModel.isRequiredDocsFilled} onClick={wizard.nextStep}>
        {t('common:next')}
      </LoadingButton>
    </WizardButtonsWrapper>
  );
});
