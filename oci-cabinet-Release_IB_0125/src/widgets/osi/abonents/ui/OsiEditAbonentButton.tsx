import { observer } from 'mobx-react-lite';
import { Icon } from '@iconify/react';
import editIcon from '@iconify-icons/uil/edit';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { tokens, TranslatedToken } from '@shared/utils/i18n';
import { OsiAddAbonentForm } from '@entities/osi/abonents';
import { Abonent } from '@shared/types/osi/abonents';
import { IOsiAbonentsWidgetViewModel } from '@shared/types/mobx/widgets/OsiAbonentsWidget';

interface Props {
  abonent: Abonent;
  vm: IOsiAbonentsWidgetViewModel;
}

export const OsiEditAbonentButton: React.FC<Props> = observer(({ abonent, vm }) => {
  const [isOpen, setIsOpen] = useState(false);

  const clickHandler = () => {
    setIsOpen(true);
  };

  const closeHandler = () => {
    setIsOpen(false);
    vm.reloadCb();
  };

  return (
    <>
      <IconButton sx={{ padding: '5px' }} onClick={clickHandler}>
        <Icon icon={editIcon} />
      </IconButton>
      <Dialog open={isOpen} maxWidth="md">
        <DialogTitle>
          <TranslatedToken id={tokens.osiAbonents.editing} />
        </DialogTitle>
        <DialogContent>
          <OsiAddAbonentForm
            data={abonent}
            onClose={closeHandler}
            totalAbonents={vm.totalAbonents}
            osiId={vm.osiId}
            areaTypes={vm.areaTypes}
          />
        </DialogContent>
      </Dialog>
    </>
  );
});
