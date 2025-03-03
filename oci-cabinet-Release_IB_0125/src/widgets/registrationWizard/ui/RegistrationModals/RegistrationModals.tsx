import { observer } from 'mobx-react-lite';
import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { RegistrationKinds } from '@shared/types/registration';
import { useTranslation } from '@shared/utils/i18n';
import { useNavigate } from 'react-router-dom';
import { useRegistrationWizardContext } from '@widgets/registrationWizard/store/RegistrationWizardProvider';
import { RegistrationModalsViewModel } from '@widgets/registrationWizard/store/RegistrationModals/RegistrationModalsViewModel';
import { useEffect } from 'react';
import { useInjection } from 'inversify-react';

export const RegistrationModals: React.FC = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const wizard = useRegistrationWizardContext();
  const viewModel = useInjection<RegistrationModalsViewModel>(RegistrationModalsViewModel);

  useEffect(() => {
    viewModel.wizard = wizard;
  }, [viewModel, wizard]);

  useEffect(() => {
    viewModel.navigate = navigate;
  }, [navigate, viewModel]);

  const isChairmanModalOpen = viewModel.isModalOpen(RegistrationKinds.CHANGE_CHAIRMAN);

  const isUnionTypeModalOpen = viewModel.isModalOpen(RegistrationKinds.CHANGE_UNION_TYPE);

  return (
    <>
      <Dialog open={isChairmanModalOpen} onClose={viewModel.cancelConfirmRegistration}>
        <DialogContent sx={{ paddingBlockEnd: 0 }}>
          <Typography align={'center'}>{t('registration:alreadyExists')}</Typography>
          <Typography align={'center'}>{t('registration:registrationKinds.changeChairman')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={viewModel.cancelConfirmRegistration}>{t('common:back')}</Button>
          <Button onClick={viewModel.confirmRegistration}>{t('common:next')}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isUnionTypeModalOpen} onClose={viewModel.cancelConfirmRegistration}>
        <DialogContent sx={{ paddingBlockEnd: 0 }}>
          <Typography align={'center'}>{t('registration:alreadyExists')}</Typography>
          <Typography align={'center'}>{t('registration:registrationKinds.changeUnionType')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={viewModel.cancelConfirmRegistration}>{t('common:back')}</Button>
          <Button onClick={viewModel.confirmRegistration}>{t('common:next')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
