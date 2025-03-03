import { observer } from 'mobx-react-lite';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import React from 'react';
import { IPenaltiesToggleViewModelToken, IPenaltiesToggleViewModel } from '@shared/types/mobx/features/osiAccruals';
import { useInjection } from 'inversify-react';
import { useTranslation } from '@shared/utils/i18n';

export const PenaltiesToggle: React.FC = observer(() => {
  const { t } = useTranslation();
  const vm = useInjection<IPenaltiesToggleViewModel>(IPenaltiesToggleViewModelToken);

  return (
    <Box>
      <FormControlLabel
        control={<Checkbox checked={vm.isFinesEnabled} onChange={vm.toggleFines} />}
        label={t('accruals:enablePenalties')}
      />
    </Box>
  );
});
