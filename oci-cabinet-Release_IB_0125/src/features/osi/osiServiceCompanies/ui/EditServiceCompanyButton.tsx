import { observer } from 'mobx-react-lite';
import { OsiServiceCompany } from '@shared/types/osi/osiServiceCompanies';
import { useInjection } from 'inversify-react';
import {
  EditOsiServiceCompanyButtonViewModelInterface,
  editOsiServiceCompanyButtonViewModelToken
} from '@shared/types/mobx/features/OsiServiceCompanies';
import { useServiceCompanyForm } from '@features/osi/osiServiceCompanies';
import { useEffect } from 'react';
import { IconButton } from '@mui/material';
import { OsiServiceCompanyDialog } from '@entities/osi/osiServiceCompanies';
import { Icon } from '@iconify/react';
import editFill from '@iconify-icons/eva/edit-fill';
import { tokens, useTranslation } from '@shared/utils/i18n';

interface Props {
  company: OsiServiceCompany;
  onUpdateSuccess: () => void;
}

export const EditServiceCompanyButton: React.FC<Props> = observer(({ company, onUpdateSuccess }) => {
  const vm = useInjection<EditOsiServiceCompanyButtonViewModelInterface>(editOsiServiceCompanyButtonViewModelToken);
  const { defaultValues } = vm;
  const { form } = useServiceCompanyForm({ defaultValues });
  const { translateToken: tt } = useTranslation();

  useEffect(() => {
    vm.setForm(form);
  }, [form, vm]);

  useEffect(() => {
    vm.setReloadServices(onUpdateSuccess);
  }, [onUpdateSuccess, vm]);

  return (
    <>
      <IconButton onClick={() => vm.onEditClick(company)}>
        <Icon icon={editFill} />
      </IconButton>
      <OsiServiceCompanyDialog
        title={tt(tokens.osiInfo.companies.editCompany)}
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
