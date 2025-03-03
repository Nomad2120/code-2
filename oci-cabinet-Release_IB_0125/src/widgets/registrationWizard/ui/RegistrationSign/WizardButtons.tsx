import { observer } from 'mobx-react-lite';
import { useRegistrationWizardContext } from '@widgets/registrationWizard/store/RegistrationWizardProvider';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from '@shared/utils/i18n';
import { WizardButtonsWrapper } from '@widgets/registrationWizard/ui/WizardButtonsWrapper';

export const WizardButtons: React.FC = observer(() => {
  const wizard = useRegistrationWizardContext();
  const { t } = useTranslation();
  const { wizardStep } = wizard;

  return (
    <WizardButtonsWrapper>
      {wizardStep !== 0 && <LoadingButton onClick={wizard.prevStep}>{t('common:back')}</LoadingButton>}
      <LoadingButton variant={'contained'} disabled={false} onClick={wizard.finish}>
        {t('common:finish')}
      </LoadingButton>
    </WizardButtonsWrapper>
  );
});
