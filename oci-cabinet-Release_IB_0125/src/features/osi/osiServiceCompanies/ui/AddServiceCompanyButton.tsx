import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';

import { useServiceCompanyForm } from '@features/osi/osiServiceCompanies/hooks/useServiceCompanyForm';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import { useEffect } from 'react';
import {
  AddOsiServiceCompanyButtonViewModelInterface,
  addOsiServiceCompanyButtonViewModelToken
} from '@shared/types/mobx/features/OsiServiceCompanies';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { Button } from '@mui/material';
import { OsiServiceCompanyDialog } from '@entities/osi/osiServiceCompanies';

interface Props {
  onAddSuccess: () => void;
}

export const AddServiceCompanyButton: React.FC<Props> = observer(({ onAddSuccess }) => {
  const vm = useInjection<AddOsiServiceCompanyButtonViewModelInterface>(addOsiServiceCompanyButtonViewModelToken);
  const { defaultValues } = vm;
  const { form } = useServiceCompanyForm({ defaultValues });
  const { translateToken: tt } = useTranslation();

  useEffect(() => {
    vm.setForm(form);
  }, [form, vm]);

  useEffect(() => {
    vm.setReloadServices(onAddSuccess);
  }, [onAddSuccess, vm]);

  return (
    <>
      <Button
        sx={{ ml: 2 }}
        variant="outlined"
        color="primary"
        startIcon={<LibraryAddIcon />}
        onClick={vm.onOpenDialogClick}
      >
        <TranslatedToken id={tokens.common.add} />
      </Button>
      <OsiServiceCompanyDialog
        title={tt(tokens.osiInfo.companies.addCompany)}
        isOpen={vm.isDialogOpen}
        onClose={vm.onCloseDialogClick}
        onSaveClick={vm.onSaveDialogClick}
        serviceCompanyTypes={vm.serviceCompanyTypes}
        control={form.control}
        formState={form.formState}
      />
    </>
  );
});
