import { Button, Card, CardContent, Typography } from '@mui/material';
import { tokens, TranslatedToken } from '@shared/utils/i18n';
import { SeoIllustration } from '@shared/assets';
import { useInjection } from 'inversify-react';
import { RegistrationModule } from '@mobx/services/registration';
import { observer } from 'mobx-react-lite';
import { ProfileModule } from '@mobx/services/profile';

export const CreateRegistrationCard = observer(() => {
  const registrationModule = useInjection(RegistrationModule);
  const profileModule = useInjection(ProfileModule);

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
          <br /> {profileModule.userData.info?.fio ?? '...'}
        </Typography>

        <Typography variant="body2" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 480, mx: 'auto' }}>
          <TranslatedToken id={tokens.cabinetRoot.subtitle} />
        </Typography>

        <Button variant="contained" onClick={registrationModule.createNewRegistration}>
          <TranslatedToken id={tokens.cabinetRoot.sendOrder} />
        </Button>
      </CardContent>
      <SeoIllustration
        sx={{
          p: 3,
          width: 360,
          margin: { xs: 'auto', md: 'inherit' }
        }}
      />
    </Card>
  );
});
