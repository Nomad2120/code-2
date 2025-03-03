import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { OsiListSearchFilter } from '@features/cabinet/osiList';
import { Osis } from '@entities/cabinet/osis';
import { useContainer } from 'inversify-react';
import { OsiModule } from '@app/stores/mobx/services/osiModule';

export const OsiList: React.FC = observer(() => {
  const osiModule = useContainer().getNamed<OsiModule>(OsiModule, 'v2');

  return (
    <Box>
      <OsiListSearchFilter />
      <Osis />
    </Box>
  );
});
