import { observer } from 'mobx-react-lite';
import { Tab, Tabs } from '@mui/material';
import { useTranslation } from '@shared/utils/i18n';

interface Props {
  tabs: any;
  currentTab: any;
  onTabChange: (tab: any) => void;
}

export const TabsPanel: React.FC<Props> = observer(({ tabs, currentTab, onTabChange }) => {
  const { translateToken: tt } = useTranslation();

  const handleChangeTab = (event: React.SyntheticEvent, newValue: any) => {
    onTabChange(newValue);
  };

  return (
    <Tabs
      value={currentTab}
      scrollButtons="auto"
      variant="scrollable"
      allowScrollButtonsMobile
      onChange={handleChangeTab}
    >
      {tabs.map((tab: any) => (
        <Tab disableRipple key={tab.value} label={tt(tab.labelToken)} icon={tab.icon} value={tab.value} />
      ))}
    </Tabs>
  );
});
