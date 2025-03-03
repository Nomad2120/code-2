import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { Card, CardContent, Typography } from '@mui/material';
import { tokens, TranslatedToken } from '@shared/utils/i18n';
import { SeoIllustration } from '@shared/assets';
import {
  ICreateRegistrationWidgetViewModel,
  ICreateRegistrationWidgetViewModelToken
} from '@shared/types/mobx/widgets/CreateRegistrationWidget';
import { CreateRegistrationButton } from '@features/registration/create';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LastCreatedRegistrationContinueDialog } from '@features/registration/lastCreatedRegistrationContinue';

export const CreateRegistrationWidget: React.FC = observer(() => {
  const vm = useInjection<ICreateRegistrationWidgetViewModel>(ICreateRegistrationWidgetViewModelToken);
  const navigate = useNavigate();

  useEffect(() => {
    vm.navigate = navigate;
  }, [navigate, vm]);
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
          <br /> {vm.fio}
        </Typography>

        <Typography variant="body2" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 480, mx: 'auto' }}>
          <TranslatedToken id={tokens.cabinetRoot.subtitle} />
        </Typography>

        <CreateRegistrationButton onClick={vm.createRegistrationButtonClicked} />
      </CardContent>
      <SeoIllustration
        sx={{
          p: 3,
          width: 360,
          margin: { xs: 'auto', md: 'inherit' }
        }}
      />
      <LastCreatedRegistrationContinueDialog
        isOpen={vm.isLastCreatedRegistrationContinueModalOpen}
        onClose={vm.closeLastCreatedRegistrationContinueModal}
        onCreateNewClick={vm.createNewRegistration}
        onLastCreatedContinueClick={vm.continueLastCreatedRegistration}
      />
    </Card>
  );
});
