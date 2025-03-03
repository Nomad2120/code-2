import React from 'react';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { useInjection } from 'inversify-react';
import HeaderBreadcrumbs from '@shared/components/HeaderBreadcrumbs';
import { Container, Grid } from '@mui/material';
import OsiMenuCard from '@pages/osi/root/OsiMenuCard';
import { observer } from 'mobx-react-lite';
import { OsiRootViewModel } from '@pages/osi/root/model/viewModel';
import { ChangeModeWidget } from '@pages/osi/root/ui/ChangeModeWidget';
import Page from '@/shared/components/Page';
import { MotionContainer, MotionInView, varFadeInUp } from '@/shared/components/animate';
import LoadingScreen from '@/shared/components/LoadingScreenFullScreen';
import { LastMonthReportWidget } from '@/widgets/osi/accountReports/lastMonthReport/ui';

const OsiRoot: React.FC = observer(() => {
  const vm = useInjection(OsiRootViewModel);
  const { translateToken: tt } = useTranslation();

  if (vm.isLoading) return <LoadingScreen />;

  const freeModeSettings = {
    enabled: vm.isFreeMode,
    cardDescription: 'demo',
    onCardClick: vm.openChangeModeModal
  };

  return (
    <Page title={vm.osiName}>
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading={vm.osiAddress}
          links={[{ name: tt(tokens.osiRoot.breadcrumbs.begin) }]}
          action={undefined}
          sx={undefined}
        />
        <MotionContainer open initial="initial" sx={{ overflow: 'hidden' }}>
          <Grid container spacing={3}>
            {vm.menuItems.map((item: any, idx: number) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={item.code}>
                <MotionInView
                  variants={varFadeInUp}
                  sx={{ height: '100%' }}
                  transition={undefined}
                  threshold={undefined}
                  key={item.code}
                >
                  <OsiMenuCard {...item} index={(idx + 4) % 4} key={item.code} freeModeSettings={freeModeSettings} />
                </MotionInView>
              </Grid>
            ))}
          </Grid>
        </MotionContainer>
        <LastMonthReportWidget />
        <ChangeModeWidget
          isOpen={vm.changeModeModalIsOpen}
          onClose={vm.closeChangeModeModal}
          onChangeModeClicked={vm.onChangeModeClicked}
        />
      </Container>
    </Page>
  );
});

export default OsiRoot;
