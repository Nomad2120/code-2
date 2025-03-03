import { observer } from 'mobx-react-lite';
import { tokens, useTranslation } from '@shared/utils/i18n';
import trash2Fill from '@iconify-icons/eva/trash-2-fill';
import DialogIconButton from '@shared/common/DialogIconButton';
import { OsiAccount } from '@shared/types/osi';
import {
  DeleteAccountButtonViewModelInterface,
  deleteAccountButtonViewModelToken
} from '@shared/types/mobx/features/osiAccounts';
import { useInjection } from 'inversify-react';
import { RegistrationAccount } from '@shared/types/registration';

interface Props {
  account: OsiAccount | RegistrationAccount;
  deleteAccountCb: (account: OsiAccount | RegistrationAccount) => Promise<void>;
}

export const DeleteAccountButton: React.FC<Props> = observer(({ account, deleteAccountCb }) => {
  const vm = useInjection<DeleteAccountButtonViewModelInterface>(deleteAccountButtonViewModelToken);
  const { translateToken: tt } = useTranslation();

  return (
    //   TODO: refactor component to tsx
    //   @ts-expect-error jsx component refactor to tsx
    <DialogIconButton
      title={tt(tokens.osiInfo.bills.deleteBill)}
      content={account.account}
      icon={trash2Fill}
      onAgree={async () => {
        await deleteAccountCb(account);
      }}
    />
  );
});
