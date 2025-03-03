import { useRegistrationWizardContext } from '@widgets/registrationWizard/store/RegistrationWizardProvider';
import {
  useGetApiRegistrationsIdAccounts,
  useGetApiRegistrationsIdDocs
} from '@shared/api/orval/registrations/registrations';
import { DocTypeCodes } from '@shared/types/registration';
import { AccountTypeCodes } from '@shared/types/dictionaries';

export const useRegistrationAccounts = () => {
  const wizard = useRegistrationWizardContext();
  const { data: accountsResponse, isLoading: isLoadingAccounts } = useGetApiRegistrationsIdAccounts(
    wizard?.registration?.id ?? 0
  );
  const { data: docsResponse, isLoading: isLoadingDocs } = useGetApiRegistrationsIdDocs(wizard.registration?.id ?? 0);

  const isAllAccountsFilled = () => {
    if (!docsResponse?.result || !accountsResponse?.result) return false;
    const docs = docsResponse.result;
    const accounts = accountsResponse.result;

    const isCurrentAccountNeed = true;
    const isSavingAccountNeed = docs.filter((doc) => doc.docTypeCode === DocTypeCodes.SAVING_IBAN_INFO).length > 0;

    const isCurrentAccountExists = accounts.filter((account) => account.type === AccountTypeCodes.CURRENT).length > 0;
    const isSavingAccountExists = accounts.filter((account) => account.type === AccountTypeCodes.SAVINGS).length > 0;

    const isCurrentAccountFilled = isCurrentAccountNeed && isCurrentAccountExists;
    const isSavingAccountFilled = isSavingAccountNeed && isSavingAccountExists;

    const isRequiredAccountsFilled = isSavingAccountNeed
      ? isCurrentAccountFilled && isSavingAccountFilled
      : isCurrentAccountFilled;

    return isRequiredAccountsFilled;
  };

  return {
    isLoading: isLoadingDocs || isLoadingAccounts,
    accounts: accountsResponse?.result,
    docs: docsResponse?.result,
    isAllAccountsFilled
  };
};
