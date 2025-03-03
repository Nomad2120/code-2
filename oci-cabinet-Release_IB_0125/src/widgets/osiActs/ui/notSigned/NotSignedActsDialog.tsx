import { observer } from 'mobx-react-lite';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from '@shared/utils/i18n';
import { OsiActsWidgetViewModel } from '@widgets/osiActs/model/viewModel';
import { PdfViewer } from '@shared/ui/pdfViewer/ui';
import Signer from '@shared/common/Signer';

interface Props {
  viewModel: OsiActsWidgetViewModel;
}

export const NotSignedActsDialog: React.FC<Props> = observer(({ viewModel }) => {
  const { notSignedActsDialog, onCloseNotSignedActsDialog, onPostSign } = viewModel;
  const { t } = useTranslation();

  return (
    <Dialog open={viewModel.notSignedActsDialog.isOpen} onClose={onCloseNotSignedActsDialog} maxWidth="lg">
      <DialogTitle>{notSignedActsDialog.act?.actNum}</DialogTitle>
      <DialogContent>
        <Box sx={{ minWidth: 1200 }}>
          {notSignedActsDialog.doc?.base64 && <PdfViewer base64={notSignedActsDialog.doc.base64} />}
        </Box>
      </DialogContent>
      <DialogActions>
        {notSignedActsDialog.doc?.base64 && (
          <Box
            sx={{
              mt: '4px',
              mr: 2
            }}
          >
            <Signer
              data={notSignedActsDialog.doc.base64}
              onPostSign={onPostSign}
              content={t('acts:notSignedActs.actions.sign')}
            />
          </Box>
        )}
        <Button variant="outlined" color="inherit" onClick={onCloseNotSignedActsDialog}>
          {t('common:cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
});
