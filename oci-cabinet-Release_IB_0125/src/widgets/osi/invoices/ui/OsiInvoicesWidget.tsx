import {
  IOsiInvoicesWidgetViewModel,
  IOsiInvoicesWidgetViewModelToken
} from '@shared/types/mobx/widgets/OsiInvoicesWidget';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { Button, Typography } from '@mui/material';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import { PartialInvoicesButton } from '@features/partial-invoices';
import { PartialInvoices } from '@widgets/partial-invoices-table';

/** выделить домен для перевода - перенести сентенции */

export const OsiInvoicesWidget: React.FC = observer(() => {
  const vm = useInjection<IOsiInvoicesWidgetViewModel>(IOsiInvoicesWidgetViewModelToken);
  const { t } = useTranslation();

  return (
    <>
      <div>
        {vm.isInvoicesEnabled ? (
          <>
            <Button
              disabled={vm.isLoading}
              variant="outlined"
              color="primary"
              onClick={vm.downloadInvoices}
              sx={{ mb: 2, mr: 1 }}
              size="medium"
            >
              <TranslatedToken id={tokens.osiInvoices.createInvoices} />
            </Button>
            <PartialInvoicesButton disabled={vm.isLoading} sx={{ mb: 2, mr: 1 }} onClick={vm.openPartialTable} />
          </>
        ) : (
          <Typography component="h2" sx={{ mt: 2, mb: 2 }}>
            {t('invoices:constraints', { beginDate: vm.invoicesBeginDay })}
          </Typography>
        )}
      </div>
      <PartialInvoices isShow={vm.isPartialTableShown} onClose={vm.closePartialTable} />
    </>
  );
});
