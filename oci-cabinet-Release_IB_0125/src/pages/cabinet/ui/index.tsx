import { Container, Grid } from '@mui/material';
import Page from '@shared/components/Page';
import useSettings from '@shared/hooks/useSettings';
import { CreateRegistrationCard } from '@entities/registration/CreateRegistrationCard';
import { OsiList } from '@widgets/osiList/ui';
import RegistrationsList from '@entities/registration/RegistrationsList/ui';
import { useInjection } from 'inversify-react';
import { useEffect } from 'react';
import { ProfileModule } from '@mobx/services/profile';
import { observer } from 'mobx-react-lite';
import { AppartmentList } from '@pages/cabinet/appartment-list/AppartmentList';
import { CreateRegistrationWidget } from '@widgets/createRegistration';
import { UserRegistrations } from '@widgets/userRegistrations';
import { CreateRegistrationButton } from '@widgets/createRegistration/ui/CreateRegistrationButton';
import { RegistrationModule } from '@/app/stores/mobx/services/registration';

const CabinetPage = observer((): JSX.Element => {
  const { themeStretch } = useSettings();
  const registrationModule = useInjection(RegistrationModule);
  const profileModule = useInjection(ProfileModule);

  useEffect(() => {
    registrationModule.clearSelected();
  }, []);

  const listByRole = {
    ABONENT: <AppartmentList />,
    CHAIRMAN: <OsiList />,
    OPERATOR: <OsiList />,
    ADMIN: <OsiList />
  };

  return (
    <Page title="Домашняя страница">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {listByRole[profileModule.userData.currentRole.role]}
          </Grid>
          <Grid item xs={12} md={6}>
            {/* <CreateRegistrationWidget /> */}
            <CreateRegistrationButton />
            {/* <CreateRegistrationCard /> */}
          </Grid>
          <Grid item xs={12}>
            {/* <RegistrationsList /> */}
            <UserRegistrations />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
});

export default CabinetPage;
