import { observer } from 'mobx-react-lite';
import { tokens, TranslatedToken } from '@shared/utils/i18n';
import { Button } from '@mui/material';

interface Props {
  onClick: () => void;
}

export const CreateRegistrationButton: React.FC<Props> = observer(({ onClick }) => {
  const vm = '';
  return (
    <Button variant="contained" onClick={onClick}>
      <TranslatedToken id={tokens.cabinetRoot.sendOrder} />
    </Button>
  );
});
