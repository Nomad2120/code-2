import { observer } from 'mobx-react-lite';
import { Button, DialogActions, DialogContent, DialogTitle, Dialog } from '@mui/material';
import { tokens, TranslatedToken } from '@shared/utils/i18n';

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  content: any;
}

export const ConfirmDialog: React.FC<Props> = observer(({ open, onConfirm, onCancel, content }) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>
      <TranslatedToken id={tokens.osiDebts.newDebt.acceptChanged} />
    </DialogTitle>
    <DialogContent>
      <TranslatedToken id={tokens.osiDebts.newDebt.saldoNotMatch} />
      {content}"
    </DialogContent>
    <DialogActions>
      <Button color="inherit" onClick={onCancel}>
        <TranslatedToken id={tokens.common.cancel} />
      </Button>
      <Button variant="contained" onClick={onConfirm}>
        <TranslatedToken id={tokens.common.accepted} />
      </Button>
    </DialogActions>
  </Dialog>
));
