import { Card, CardContent, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useContainer } from 'inversify-react';
import { OsiModule } from '@mobx/services/osiModule';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';

interface Props {
  osi: any;
}

export const OsiCard: React.FC<Props> = observer(({ osi }) => {
  const osiModule = useContainer().getNamed<OsiModule>(OsiModule, 'v2');

  const selectOsiHandler = async () => {
    await osiModule.selectOsi(osi.id);
  };

  return (
    <Card
      className="osiCard-wrapper"
      raised
      sx={{ backgroundColor: 'transparent' }}
      onClick={selectOsiHandler}
      data-test-id={`${osi.name}`}
    >
      <CardContent className="osiCard-element text-slate-800">
        <Typography sx={{ fontSize: '1.6rem' }} variant="subtitle1">
          {osi.name}
        </Typography>
        <Typography sx={{ fontSize: '1.4rem' }} variant="subtitle2">
          {osi.address}
        </Typography>
      </CardContent>
    </Card>
  );
});
