import { OsiServiceCompany } from '@shared/types/osi/osiServiceCompanies';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import {
  DeleteOsiServiceCompanyButtonViewModelInterface,
  deleteOsiServiceCompanyButtonViewModelToken
} from '@shared/types/mobx/features/OsiServiceCompanies';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { useEffect } from 'react';
import DialogIconButton from '@shared/common/DialogIconButton';
import trash2Fill from '@iconify-icons/eva/trash-2-fill';

interface Props {
  company: OsiServiceCompany;
  onDeleteSuccess: () => void;
}

export const DeleteServiceCompanyButton: React.FC<Props> = observer(({ company, onDeleteSuccess }) => {
  const vm = useInjection<DeleteOsiServiceCompanyButtonViewModelInterface>(deleteOsiServiceCompanyButtonViewModelToken);
  const { translateToken: tt, fieldWithPrefix: fwp } = useTranslation();

  useEffect(() => {
    vm.setReloadServices(onDeleteSuccess);
  }, [onDeleteSuccess, vm]);

  return (
    //   TODO: refactor component to tsx
    //   @ts-expect-error jsx component refactor to tsx
    <DialogIconButton
      title={tt(tokens.osiInfo.companies.deleteCompany)}
      content={fwp(company, 'serviceCompanyName')}
      icon={trash2Fill}
      onAgree={() => {
        vm.onConfirmDeleteClick(company);
      }}
    />
  );
});
