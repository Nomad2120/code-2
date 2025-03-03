import { Box, Tab } from '@mui/material';
import { useTranslation } from '@shared/utils/i18n';
import { observer } from 'mobx-react-lite';
import { RegistrationWidgetViewModel } from '@widgets/authRegistration/model/viewModel';
import LoadingWrapper from '@shared/components/LoadingWrapper';
import { useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { SMSConfirm } from '@widgets/authRegistration/ui/SMSConfirm';
import { TelegramConfirm } from '@widgets/authRegistration/ui/TelegramConfirm';

interface Props {
  viewModel: RegistrationWidgetViewModel;
}

export const RegistrationConfirmPhone: React.FC<Props> = observer(({ viewModel }) => {
  const { translateToken: tt } = useTranslation();
  const [currentTab, setCurrentTab] = useState('sms');

  const onTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const { botUrl, goToVerifyCode, verifySmsMethod, returnToLogin } = viewModel;

  if (!botUrl) return <LoadingWrapper />;

  return (
    <Box>
      <TabContext value={currentTab}>
        <Box>
          <TabList onChange={onTabChange} aria-label={'select verify method tabs'}>
            <Tab label={'sms'} value={'sms'} />
            <Tab label={'telegram'} value={'telegram'} />
          </TabList>
        </Box>
        <Box>
          <TabPanel value="sms">
            <SMSConfirm
              phone={viewModel.phone}
              goToVerifyCode={verifySmsMethod}
              timerState={viewModel.timerState}
              cancelRegistration={returnToLogin}
            />
          </TabPanel>
          <TabPanel value="telegram">
            <TelegramConfirm
              phone={viewModel.phone}
              botUrl={botUrl}
              goToVerifyCode={goToVerifyCode}
              cancelRegistration={returnToLogin}
            />
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  );
});
