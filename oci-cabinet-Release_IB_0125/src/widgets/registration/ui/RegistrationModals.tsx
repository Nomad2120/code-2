import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { RegistrationViewModel } from '@widgets/registration/model';
import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { RegistrationKinds } from '@shared/types/registration';
import { useTranslation } from '@shared/utils/i18n';

export const RegistrationModals: React.FC = observer(() => {
  const vm = useInjection(RegistrationViewModel);
  const { t } = useTranslation();

  return (
    <>
      <Dialog open={vm.isModalOpen(RegistrationKinds.CHANGE_CHAIRMAN)} onClose={vm.cancelConfirmRegistration}>
        <DialogContent sx={{ paddingBlockEnd: 0 }}>
          <Typography align={'center'}>{t('registration:alreadyExists')}</Typography>
          <Typography align={'center'}>{t('registration:registrationKinds.changeChairman')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={vm.cancelConfirmRegistration}>{t('common:back')}</Button>
          <Button onClick={vm.confirmRegistration}>{t('common:next')}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={vm.isModalOpen(RegistrationKinds.CHANGE_UNION_TYPE)} onClose={vm.cancelConfirmRegistration}>
        <DialogContent sx={{ paddingBlockEnd: 0 }}>
          <Typography align={'center'}>{t('registration:alreadyExists')}</Typography>
          <Typography align={'center'}>{t('registration:registrationKinds.changeUnionType')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={vm.cancelConfirmRegistration}>{t('common:back')}</Button>
          <Button onClick={vm.confirmRegistration}>{t('common:next')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
