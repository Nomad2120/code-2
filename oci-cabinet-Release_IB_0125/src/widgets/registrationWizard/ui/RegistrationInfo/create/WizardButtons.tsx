import { observer } from 'mobx-react-lite';
import { useRegistrationWizardContext } from '@widgets/registrationWizard/store/RegistrationWizardProvider';
import { LoadingButton } from '@mui/lab';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from '@shared/utils/i18n';
import { WizardButtonsWrapper } from '@widgets/registrationWizard/ui/WizardButtonsWrapper';

interface Props {
  onSubmit: (values: any) => Promise<void>;
}

export const WizardButtons: React.FC<Props> = observer(({ onSubmit }) => {
  const wizard = useRegistrationWizardContext();
  const { t } = useTranslation();
  const {
    formState: { isValid },
    handleSubmit
  } = useFormContext();

  const { wizardStep } = wizard;

  return (
    <WizardButtonsWrapper>
      {wizardStep !== 0 && <LoadingButton onClick={wizard.prevStep}>{t('common:back')}</LoadingButton>}
      <LoadingButton variant={'contained'} disabled={!isValid} onClick={handleSubmit(onSubmit)}>
        {t('common:next')}
      </LoadingButton>
    </WizardButtonsWrapper>
  );
});
