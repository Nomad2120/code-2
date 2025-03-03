import { observer } from 'mobx-react-lite';
import { useTranslation } from '@shared/utils/i18n';
import { Box, Typography } from '@mui/material';
import { RegistrationPhone } from '@widgets/authRegistration/ui/RegistrationPhone';
import { RegistrationConfirmPhone } from '@widgets/authRegistration/ui/RegistrationConfirmPhone';
import { RegistrationVerifyCode } from '@widgets/authRegistration/ui/RegistrationVerifyCode';
import { ChangePassword } from '@widgets/authRegistration/ui/ChangePassword';
import { useInjection } from 'inversify-react';
import { RegistrationWidgetViewModel, WidgetStates } from '@widgets/authRegistration/model/viewModel';
import { ReactNode, useMemo } from 'react';
import { UserInfoForm } from '@widgets/authRegistration/ui/UserInfoForm';
import { useInstructions } from '@shared/hooks/instructions/useInstructions';
import { links as instructionKeys } from '@shared/instructions/config';
import { InstructionButton } from '@shared/components/InstructionButton/InstructionButton';
import { styled } from '@mui/material/styles';

const InstructionButtonStyled = styled(InstructionButton)(({ theme }) => ({
  maxWidth: '180px',
  maxHeight: '90px',
  minWidth: '120px',
  minHeight: '70px',
  width: 'unset',
  height: 'unset'
}));

export const RegistrationWidget: React.FC = observer(() => {
  const { t } = useTranslation();

  const viewModel = useInjection(RegistrationWidgetViewModel);
  const { onInstructionClick } = useInstructions({ key: instructionKeys.auth });

  const States: Record<WidgetStates, ReactNode> = useMemo(
    () => ({
      // TODO:шаг с проверкой телефона устрел - нужно безопасно вырезать теперь регистрация начинается с confirmPhone
      phone: <RegistrationPhone viewModel={viewModel} />,
      confirmPhone: <RegistrationConfirmPhone viewModel={viewModel} />,
      verifyCode: <RegistrationVerifyCode viewModel={viewModel} />,
      changePassword: <ChangePassword viewModel={viewModel} />,
      userInfo: <UserInfoForm viewModel={viewModel} />
    }),
    [viewModel]
  );

  return (
    <Box>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Box sx={{ flexGrow: 1, position: 'relative' }}>
          <Typography variant="h4" gutterBottom>
            {t('auth:register.title')}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>{t('auth:register.subtitle')}</Typography>
        </Box>
        <Box>
          <InstructionButtonStyled onClick={onInstructionClick} />
        </Box>
      </Box>
      <Box>{States[viewModel.state]}</Box>
    </Box>
  );
});
