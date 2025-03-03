import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onAccept: () => void;
}

export const AcceptDialog: React.FC<Props> = observer(({ isOpen, onCancel, onAccept }) => {
  const { t } = useTranslation();
  const closeHandler = (e: any, reason: string) => {
    if (reason === 'backdropClick') return;

    if (onCancel) onCancel();
  };

  const acceptHandler = () => {
    if (onAccept) onAccept();
  };

  return (
    <Dialog open={isOpen} onClose={closeHandler}>
      <DialogContent>
        <Typography>{t('accountReports:forms.accept.warning1')}</Typography>
        <Typography>{t('accountReports:forms.accept.warning2')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant={'outlined'} size={'small'} onClick={closeHandler as any}>
          {t('common:cancel')}
        </Button>
        <Button variant={'contained'} size={'small'} onClick={acceptHandler}>
          {t('accountReports:publish')}
        </Button>
      </DialogActions>
    </Dialog>
  );
});
