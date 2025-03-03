import { observer } from 'mobx-react-lite';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from '@shared/utils/i18n';
import PrintIcon from '@mui/icons-material/PrintOutlined';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { OsiActsWidgetViewModel } from '@widgets/osiActs/model/viewModel';
import { PdfViewer } from '@shared/ui/pdfViewer/ui';

interface Props {
  viewModel: OsiActsWidgetViewModel;
}

export const SignedActsDialog: React.FC<Props> = observer(({ viewModel }) => {
  const { signedActsDialog, onCloseSignedActsDialog, onPrintAct, onDownloadAct } = viewModel;
  const { t } = useTranslation();

  return (
    <Dialog open={viewModel.signedActsDialog.isOpen} onClose={onCloseSignedActsDialog} maxWidth="lg">
      <DialogTitle>{signedActsDialog.act?.actNum}</DialogTitle>
      <DialogContent>
        <Box sx={{ minWidth: 1200 }}>
          {signedActsDialog.doc?.base64 && <PdfViewer base64={signedActsDialog.doc.base64} />}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" startIcon={<PrintIcon />} onClick={onPrintAct}>
          {t('common:print')}
        </Button>
        <Button variant="outlined" startIcon={<CloudDownloadIcon />} onClick={onDownloadAct}>
          {t('common:save')}
        </Button>
        <Button variant="outlined" color="inherit" onClick={onCloseSignedActsDialog}>
          {t('common:close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
});
