import { observer } from 'mobx-react-lite';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { tokens, TranslatedToken } from '@shared/utils/i18n';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import React, { MutableRefObject, useState } from 'react';
import { OsiAddAbonentForm } from '@entities/osi/abonents';
import { IOsiAbonentsWidgetViewModel } from '@shared/types/mobx/widgets/OsiAbonentsWidget';
import { gridPaginatedVisibleSortedGridRowEntriesSelector, gridVisibleRowCountSelector } from '@mui/x-data-grid-pro';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';

interface Props {
  vm: IOsiAbonentsWidgetViewModel;
  apiRef: MutableRefObject<GridApiPro>;
}

export const OsiAddAbonentButton: React.FC<Props> = observer(({ vm, apiRef }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClickHandler = () => {
    const id = vm.addAbonent();
    setTimeout(() => {
      apiRef.current.startRowEditMode({ id, fieldToFocus: 'square' });
      const lastRowIndex = gridVisibleRowCountSelector(apiRef) - 1;
      setTimeout(() => {
        apiRef.current.scrollToIndexes({ rowIndex: lastRowIndex });
      });
    });
  };

  const closehandler = () => {
    setIsOpen(false);
    vm.reloadCb();
  };

  return (
    <>
      <Button sx={{ ml: 2 }} variant="outlined" color="primary" startIcon={<LibraryAddIcon />} onClick={onClickHandler}>
        <TranslatedToken id={tokens.common.add} />
      </Button>
      <Dialog open={isOpen} maxWidth="md">
        <DialogTitle>
          <TranslatedToken id={tokens.osiAbonents.addFlat} />
        </DialogTitle>
        <DialogContent>
          <OsiAddAbonentForm
            onClose={closehandler}
            totalAbonents={vm.totalAbonents}
            osiId={vm.osiId}
            areaTypes={vm.areaTypes}
          />
        </DialogContent>
      </Dialog>
    </>
  );
});
