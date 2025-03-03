import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import {
  IOsiCreatePaymentFeatureViewModel,
  IOsiCreatePaymentFeatureViewModelToken
} from '@shared/types/mobx/features/osiPayments';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { OsiPaymentForm } from '@entities/osi/payments';
import { LoadingButton } from '@mui/lab';
import { useEffect } from 'react';

interface Props {
  onSuccess: () => Promise<void>;
}

export const OsiCreatePaymentButton: React.FC<Props> = observer(({ onSuccess }) => {
  const vm = useInjection<IOsiCreatePaymentFeatureViewModel>(IOsiCreatePaymentFeatureViewModelToken);
  const { translateToken: tt } = useTranslation();

  useEffect(() => {
    vm.onSuccessCb = onSuccess;
  }, [onSuccess, vm]);

  return (
    <>
      <LoadingButton
        loading={vm.isLoading}
        variant="outlined"
        color="primary"
        onClick={vm.openDialog}
        sx={{ mb: 2, mr: 1 }}
        size="medium"
      >
        {tt(tokens.osiPayments.formElements.createPayment)}
      </LoadingButton>
      <Dialog open={vm.isDialogOpen} onClose={vm.closeDialog}>
        <DialogTitle>{tt(tokens.osiPayments.formElements.createPayment)}</DialogTitle>
        <DialogContent>
          <OsiPaymentForm
            abonents={vm.abonents}
            groups={vm.groups}
            onClose={vm.closeDialog}
            onSubmit={vm.createPayment}
          />
        </DialogContent>
      </Dialog>
    </>
  );
});
