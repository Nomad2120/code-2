import { Container, Grid } from '@mui/material';

import HeaderBreadcrumbs from '@shared/components/HeaderBreadcrumbs';
import { MENU_ITEMS } from '@app/layouts/appartment/SidebarConfig';
import Page from '../../../shared/components/Page';
import { MotionContainer, MotionInView, varFadeInUp } from '../../../shared/components/animate';

import { AppartmentMenuCard } from './AppartmentMenuCard';

const AppartmentRoot = () => (
  <Page title="Кабинет Абонента">
    <Container maxWidth="xl">
      <HeaderBreadcrumbs heading="Кабинет Абонента" links={[{ name: 'Начало' }]} />
      <MotionContainer open initial="initial" sx={{ overflow: 'hidden' }}>
        <Grid container spacing={3}>
          {MENU_ITEMS.map((card, idx) => (
            <Grid key={idx} item xs={12} sm={6} md={4} lg={3}>
              <MotionInView variants={varFadeInUp} sx={{ height: '100%' }}>
                <AppartmentMenuCard
                  path={card.path}
                  icon={card.icon}
                  active={card.active}
                  title={card.titleToken}
                  index={(idx + 4) % 4}
                />
              </MotionInView>
            </Grid>
          ))}
        </Grid>
      </MotionContainer>
    </Container>
  </Page>
);

export default AppartmentRoot;
