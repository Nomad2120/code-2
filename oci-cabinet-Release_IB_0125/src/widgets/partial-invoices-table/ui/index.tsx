import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { observer } from 'mobx-react-lite';
import { FC, useEffect } from 'react';
import { useInjection } from 'inversify-react';
import { PartialInvoicesStore } from '@widgets/partial-invoices-table';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import { LOCALES } from '@shared/utils/i18n/locales';
import LoadingScreen from '../../../shared/components/LoadingScreenFullScreen';

interface Props {
  isShow: boolean;
  onClose: () => void;
}

export const PartialInvoices: FC<Props> = observer(({ isShow, onClose }) => {
  const partialInvoicesStore = useInjection(PartialInvoicesStore);

  const { translateToken: tt, getGridLocale, t, intl } = useTranslation();

  useEffect(() => {
    partialInvoicesStore.loadAbonents();
    partialInvoicesStore.setSelectedIds(partialInvoicesStore.restoreSelectedIds());
  }, []);

  const columns = [
    {
      field: 'flat',
      headerName: t('invoices:partialInvoices.flat'),
      flex: 1
    },
    {
      field: 'name',
      headerName: t('invoices:partialInvoices.owner'),
      flex: 3
    },
    {
      field: `areaTypeName${intl.locale === LOCALES.RU ? 'Ru' : 'Kz'}`,
      headerName: t('invoices:partialInvoices.areaType'),
      flex: 1
    },
    {
      field: 'id',
      headerName: t('invoices:partialInvoices.id'),
      flex: 1
    },
    {
      field: 'square',
      headerName: t('invoices:partialInvoices.square'),
      flex: 1
    }
  ];

  const selectionModelHandler = (selectedIds: any): void => {
    partialInvoicesStore.setSelectedIds(selectedIds);
  };

  if (partialInvoicesStore.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Dialog maxWidth={false} open={isShow} onClose={onClose}>
      <DialogTitle>{t('invoices:partialInvoices.title')}</DialogTitle>
      <DialogContent>
        <Box sx={{ width: 1000, height: 'auto' }}>
          <DataGridPro
            localeText={getGridLocale()}
            rows={partialInvoicesStore.sortedAbonents}
            columns={columns}
            density="compact"
            checkboxSelection
            onSelectionModelChange={selectionModelHandler}
            selectionModel={partialInvoicesStore.selectedIds}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="text">
          <TranslatedToken id={tokens.common.close} />
        </Button>
        <Button onClick={partialInvoicesStore.getInvoices} variant="contained">
          <TranslatedToken id={tokens.osiInvoices.create} />
        </Button>
      </DialogActions>
    </Dialog>
  );
});
