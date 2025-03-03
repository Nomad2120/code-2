import { Registration } from '@widgets/registration/ui';
import { Helmet } from 'react-helmet-async';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { RegistrationWizard } from '@widgets/registrationWizard/ui/RegistrationWizard';

export default function RegistrationPage() {
  const { translateToken: tt } = useTranslation();

  const title = tt(tokens.cabinetRoot.registration.title);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {/* <Registration /> */}
      <RegistrationWizard />
    </>
  );
}
