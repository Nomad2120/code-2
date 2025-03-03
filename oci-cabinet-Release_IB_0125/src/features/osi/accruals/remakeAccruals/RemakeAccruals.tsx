import { observer } from 'mobx-react-lite';
import { ViewModel } from '@features/osi/accruals/remakeAccruals/viewModel';
import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { useTranslation } from '@shared/utils/i18n';
import { useInjection } from 'inversify-react';
import { LoadingButton } from '@mui/lab';

export const RemakeAccruals: React.FC = observer(() => {
  const { t } = useTranslation();
  const viewModel = useInjection<ViewModel>(ViewModel);

  const closeHandler = (e: any, reason: string) => {
    if (reason === 'backdropClick') return;
    viewModel.closeModal();
  };

  return (
    <Box>
      <Button variant={'outlined'} size={'small'} onClick={viewModel.openModal}>
        {t('accruals:remakeAccruals.actionBtn')}
      </Button>
      <Dialog open={viewModel.isOpenModal} onClose={closeHandler}>
        <DialogContent sx={{ '&:first-child': { paddingBlockStart: '44px', paddingBlockEnd: 0 } }}>
          <Box>
            <Typography>{t('accruals:remakeAccruals.dialogText')}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color={'error'} variant={'outlined'} onClick={viewModel.closeModal}>
            {t('common:cancel')}
          </Button>
          <LoadingButton loading={viewModel.isLoading} onClick={viewModel.remakeAccruals} variant={'outlined'}>
            {t('common:continueText')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
