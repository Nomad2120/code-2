import {
  IQrCodeInvoicesWidgetViewModel,
  IQrCodeInvoicesWidgetViewModelToken
} from '@shared/types/mobx/widgets/OsiInvoicesQrCode';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { tokens, TranslatedToken } from '@shared/utils/i18n';
import React from 'react';
import LoadingScreen from '@shared/components/LoadingScreen';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import PrintIcon from '@mui/icons-material/PrintOutlined';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PdfView from '@shared/common/PdfView';

export const QrCodeInvoicesWidget: React.FC = observer(() => {
  const vm = useInjection<IQrCodeInvoicesWidgetViewModel>(IQrCodeInvoicesWidgetViewModelToken);

  if (vm.isLoading) return <LoadingScreen />;

  return (
    <div>
      {!vm.isLoading ? (
        <>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 2 }}>
            <Box className="flex flex-col items-start">
              <Typography variant="h5" sx={{ fontWeight: 700, pb: 1, textAlign: 'center' }}>
                <TranslatedToken id={tokens.osiInvoices.telegramLinkHeader} />
              </Typography>

              <Typography variant="body1">
                <TranslatedToken id={tokens.osiInvoices.telegramLinkInfo1} />
                <a href={vm.tgLink} style={{ color: '#0088cc', textDecoration: 'underline' }}>
                  {vm.tgLink}
                </a>
                <TranslatedToken id={tokens.osiInvoices.telegramLinkInfo2} />
              </Typography>
              <Typography variant="body1">
                <TranslatedToken id={tokens.osiInvoices.videoInfo} />
                <a href={vm.qrCodeInfoVideoLink} className="text-[#0088cc] underline">
                  {vm.qrCodeInfoVideoLink}
                </a>
              </Typography>
            </Box>
          </Card>
          <Card sx={{ alignItems: 'center', p: 2, mb: 2 }}>
            <Box alignItems="center">
              <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
                <Box display="flex" alignItems="center" sx={{ height: '100%', mt: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<PrintIcon />}
                    onClick={vm.printQrCode}
                    sx={{ ml: 1 }}
                    size="medium"
                    disabled={!vm.pdf || vm.pdf === ''}
                  >
                    <TranslatedToken id={tokens.common.print} />
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CloudDownloadIcon />}
                    onClick={vm.downloadQrCode}
                    sx={{ ml: 1 }}
                    size="medium"
                    disabled={!vm.pdf || vm.pdf === ''}
                  >
                    <TranslatedToken id={tokens.common.save} />
                  </Button>
                </Box>
              </Grid>
            </Box>
            <Box sx={{ minWidth: 600, mt: 2 }}>{vm.pdf && <PdfView pdfBase64={vm.pdf} />}</Box>
          </Card>
        </>
      ) : (
        ''
      )}
    </div>
  );
});
