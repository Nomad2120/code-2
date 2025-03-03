import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import {
  IOsiCreateCorrectionFeatureViewModel,
  IOsiCreateCorrectionFeatureViewModelToken
} from '@shared/types/mobx/features/OsiCorrection';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { OsiCorrectionForm } from '@entities/osi/correction';
import { useEffect } from 'react';

interface Props {
  onSuccess: () => Promise<void>;
}

export const OsiCreateCorrectionButton: React.FC<Props> = observer(({ onSuccess }) => {
  const vm = useInjection<IOsiCreateCorrectionFeatureViewModel>(IOsiCreateCorrectionFeatureViewModelToken);
  const { translateToken: tt } = useTranslation();

  useEffect(() => {
    vm.onSuccessCb = onSuccess;
  }, [onSuccess, vm]);

  return (
    <>
      <LoadingButton
        variant="outlined"
        color="primary"
        onClick={vm.openDialog}
        loading={vm.isLoading}
        sx={{ mb: 2, mr: 1 }}
        size="medium"
      >
        {tt(tokens.osiPayments.formElements.createCorrection)}
      </LoadingButton>
      <Dialog open={vm.isDialogOpen} onClose={vm.closeDialog}>
        <DialogTitle>{tt(tokens.osiPayments.formElements.createCorrection)}</DialogTitle>
        <DialogContent>
          <OsiCorrectionForm
            groups={vm.groups}
            abonents={vm.abonents}
            onClose={() => vm.closeDialog()}
            onSubmit={vm.createCorrection}
          />
        </DialogContent>
      </Dialog>
    </>
  );
});
