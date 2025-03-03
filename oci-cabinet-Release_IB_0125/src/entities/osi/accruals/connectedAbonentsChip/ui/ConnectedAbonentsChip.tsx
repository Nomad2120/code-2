import { Chip, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Trans, useTranslation } from 'react-i18next';

interface Props {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const ConnectedAbonentsChip: React.FC<Props> = observer(({ label, disabled, onClick }) => {
  const { t } = useTranslation();
  return (
    <>
      <Typography sx={{ display: 'inline-flex', mt: 2, mr: 1 }}>
        <Trans t={t} id={'accruals:connectedAbonents'} />
      </Typography>
      <Chip
        label={label}
        color="success"
        icon={<AccountCircleIcon />}
        variant="outlined"
        onClick={onClick}
        disabled={disabled}
      />
    </>
  );
});
