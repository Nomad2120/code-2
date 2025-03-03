import { observer } from 'mobx-react-lite';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useTranslation } from '@shared/utils/i18n';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLastCreatedContinueClick: () => void;
  onCreateNewClick: () => void;
}

export const LastCreatedRegistrationContinueDialog: React.FC<Props> = observer(
  ({ isOpen, onClose, onLastCreatedContinueClick, onCreateNewClick }) => {
    const { t } = useTranslation();

    return (
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={'sm'}>
        <DialogTitle
          sx={{
            mt: 6,
            py: 2,
            px: 2
          }}
        >
          <Typography variant={'subtitle1'} align={'center'}>
            {t('registration:lastCreatedRegistrationContinueModalTitle')}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 0 }}>
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              my: 3
            }}
          >
            <Button sx={{ width: '50%' }} variant="outlined" onClick={onLastCreatedContinueClick}>
              {t('common:continueText')}
            </Button>
            <Button sx={{ width: '50%' }} variant="outlined" onClick={onCreateNewClick}>
              {t('registration:createNew')}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pt: '0 !important' }}>
          <Button variant={'outlined'} onClick={onClose}>
            {t('common:back')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);
