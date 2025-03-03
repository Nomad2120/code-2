import { observer } from 'mobx-react-lite';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onChangeModeClicked: () => void;
}

const DialogStyled = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    '& .MuiDialogActions-root': {
      paddingTop: theme.spacing(0)
    },
    '& .MuiDialogContent-root': {
      'padding-block': theme.spacing(3)
    }
  }
}));

export const ChangeModeWidget: React.FC<Props> = observer(({ isOpen, onClose, onChangeModeClicked }) => {
  const { t } = useTranslation();
  return (
    <DialogStyled open={isOpen} onClose={onClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>{t('demo:changeModal.title')}</DialogTitle>
      <DialogContent>
        <Typography align={'center'}>{t('demo:changeModal.content')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common:close')}</Button>
      </DialogActions>
    </DialogStyled>
  );
});
