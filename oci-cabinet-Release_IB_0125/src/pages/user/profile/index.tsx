import { useState } from 'react';
import { Icon } from '@iconify/react';
import roundVpnKey from '@iconify/icons-ic/round-vpn-key';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
import { Box, Container, Stack, Tab, Tabs } from '@mui/material';
import HeaderBreadcrumbs from '@shared/components/HeaderBreadcrumbs';
import { AccountGeneralWidget } from '@widgets/accountGeneral';
import { AccountChangePasswordWidget } from '@widgets/accountChangePassword';
import { PATH_CABINET } from '@app/routes/paths';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { observer } from 'mobx-react-lite';
import useSettings from '../../../shared/hooks/useSettings';
import Page from '../../../shared/components/Page';

const UserAccountPage = observer(() => {
  const { themeStretch } = useSettings();
  const [currentTab, setCurrentTab] = useState('general');
  const { translateToken: tt } = useTranslation();

  const ACCOUNT_TABS = [
    {
      value: 'general',
      label: tt(tokens.cabinetRoot.user.main),
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <AccountGeneralWidget />
    },
    {
      value: 'change_password',
      label: tt(tokens.cabinetRoot.user.changePassword),
      icon: <Icon icon={roundVpnKey} width={20} height={20} />,
      component: <AccountChangePasswordWidget />
    }
  ];

  const handleChangeTab = (event: any, newValue: any) => {
    setCurrentTab(newValue);
  };

  return (
    <Page title="Профиль пользователя">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={tt(tokens.cabinetRoot.user.title)}
          links={[
            { name: tt(tokens.cabinetRoot.user.navigation.home), href: PATH_CABINET.root },
            { name: tt(tokens.cabinetRoot.user.navigation.profile) }
          ]}
        />
        <Stack spacing={5}>
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={handleChangeTab}
          >
            {ACCOUNT_TABS.map((tab) => (
              <Tab disableRipple key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>

          {ACCOUNT_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Stack>
      </Container>
    </Page>
  );
});

export default UserAccountPage;
