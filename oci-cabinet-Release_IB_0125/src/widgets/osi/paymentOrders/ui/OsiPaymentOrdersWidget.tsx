import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import {
  IOsiPaymentOrdersWidgetViewModel,
  IOsiPaymentOrdersWidgetViewModelToken
} from '@shared/types/mobx/widgets/OsiPaymentOrdersWidget';
import React from 'react';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import LoadingScreen from '@shared/components/LoadingScreen';
import { Box, Button, Grid, TextField } from '@mui/material';
import { MobileDatePicker } from '@mui/lab';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

export const OsiPaymentOrdersWidget: React.FC = observer(() => {
  const vm = useInjection<IOsiPaymentOrdersWidgetViewModel>(IOsiPaymentOrdersWidgetViewModelToken);

  const { translateToken: tt } = useTranslation();

  if (vm.isLoading) return <LoadingScreen />;

  return (
    <Box display="flex" alignItems="center">
      <Grid container spacing={1}>
        <Grid item xs={6} sm={2}>
          <MobileDatePicker
            orientation="portrait"
            value={vm.startDate}
            toolbarTitle="Укажите начало периода"
            onChange={(newValue) => {
              vm.startDate = newValue;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                fullWidth
                margin="none"
                label={tt(tokens.common.formFields.fromDate.label)}
              />
            )}
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <MobileDatePicker
            orientation="portrait"
            value={vm.endDate}
            toolbarTitle="Укажите конец периода"
            onChange={(newValue) => {
              vm.endDate = newValue;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                fullWidth
                margin="none"
                label={tt(tokens.common.formFields.toDate.label)}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box display="flex" alignItems="center" sx={{ height: '100%' }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<CloudDownloadIcon />}
              onClick={vm.download}
              sx={{ ml: 1 }}
              size="medium"
              disabled={vm.startDate > vm.endDate}
            >
              <TranslatedToken id={tokens.common.download} />
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
});
