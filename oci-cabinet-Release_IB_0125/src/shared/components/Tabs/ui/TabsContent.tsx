import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';

interface Props {
  tabs: any;
  currentTab: any;
  className?: string;
  sx?: any;
}

export const TabsContent: React.FC<Props> = observer(({ tabs, currentTab, className, sx }) => (
  <Box className={className} sx={sx}>
    {tabs.map((tab) => {
      const isActive = tab.value === currentTab;
      return (
        isActive && (
          <Box key={tab.value} sx={{ mt: 2 }}>
            {tab.component}
          </Box>
        )
      );
    })}
  </Box>
));
