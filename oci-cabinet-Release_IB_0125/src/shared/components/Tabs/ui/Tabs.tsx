import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import { TabsPanel } from './TabsPanel';
import { TabsContent } from './TabsContent';

interface Props {
  tabs: any;
  currentTab: any;
  onTabChange: (tab: any) => void;
  className?: string;
  sx?: any;
}

export const Tabs: React.FC<Props> = observer(({ tabs, currentTab, onTabChange, className, sx }) => (
  <Box className={className} sx={sx}>
    <TabsPanel tabs={tabs} currentTab={currentTab} onTabChange={onTabChange} />
    <TabsContent tabs={tabs} currentTab={currentTab} />
  </Box>
));
