import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { Card, CardContent, Typography } from '@mui/material';
import { tokens, TranslatedToken } from '@shared/utils/i18n';
import { SeoIllustration } from '@shared/assets';
import { CreateRegistrationButton as CreateRegistration } from '@features/registration/create';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LastCreatedRegistrationContinueDialog } from '@features/registration/lastCreatedRegistrationContinue';
import { useGetApiUsersIdRegistrations } from '@shared/api/orval/users/users';
import { ProfileModule } from '@mobx/services/profile';
import { EnumsRegistrationStateCodes } from '@shared/api/orval/models';
import { PATH_CABINET } from '@app/routes/paths';

export const CreateRegistrationButton: React.FC = observer(() => {
  const navigate = useNavigate();
  const profileModule = useInjection<ProfileModule>(ProfileModule);
  const { data: allRegistrationResponse } = useGetApiUsersIdRegistrations(profileModule.userData.id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const lastCreatedRegistration = allRegistrationResponse?.result
    ?.filter(
      (registration) =>
        registration.stateCode === EnumsRegistrationStateCodes.CREATED ||
        registration.stateCode === EnumsRegistrationStateCodes.PREPARED
    )
    ?.sort((a, b) => new Date(b.createDt).getTime() - new Date(a.createDt).getTime())[0];

  const { fio } = profileModule.userData.info;

  const onCreateRegistrationButtonClicked = () => {
    if (!lastCreatedRegistration) {
      createNewRegistration();
      return;
    }

    openContinueModal();
  };

  const openContinueModal = () => {
    setIsModalOpen(true);
  };

  const closeContinueModal = () => {
    setIsModalOpen(false);
  };

  const createNewRegistration = () => {
    navigate(PATH_CABINET.registration);
  };

  const continueLastCreatedRegistration = () => {
    navigate(PATH_CABINET.registration, { state: { registrationId: lastCreatedRegistration?.id } });
  };

  return (
    <Card
      sx={(theme: any) => ({
        boxShadow: 'none',
        textAlign: { xs: 'center', md: 'left' },
        backgroundColor: theme.palette.primary.lighter,
        height: { md: '100%' },
        minHeight: { md: 280 },
        display: { md: 'flex' },
        alignItems: { md: 'center' },
        justifyContent: { md: 'space-between' }
      })}
    >
      <CardContent
        sx={{
          p: { md: 0 },
          pl: { md: 5 },
          color: 'grey.800'
        }}
      >
        <Typography gutterBottom variant="h4">
          <TranslatedToken id={tokens.common.welcome} />
          ,
          <br /> {fio}
        </Typography>

        <Typography variant="body2" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 480, mx: 'auto' }}>
          <TranslatedToken id={tokens.cabinetRoot.subtitle} />
        </Typography>

        <CreateRegistration onClick={onCreateRegistrationButtonClicked} />
      </CardContent>
      <SeoIllustration
        sx={{
          p: 3,
          width: 360,
          margin: { xs: 'auto', md: 'inherit' }
        }}
      />
      <LastCreatedRegistrationContinueDialog
        isOpen={isModalOpen}
        onClose={closeContinueModal}
        onCreateNewClick={createNewRegistration}
        onLastCreatedContinueClick={continueLastCreatedRegistration}
      />
    </Card>
  );
});
