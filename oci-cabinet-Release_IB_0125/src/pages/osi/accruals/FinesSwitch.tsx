import React from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { tokens, useTranslation } from '@shared/utils/i18n';

interface Props {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FinesSwitch: React.FC<Props> = ({ checked, onChange }) => {
  const { translateToken: tt } = useTranslation();

  return (
    <Box>
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={onChange} />}
        label={tt(tokens.common.finesSwitch)}
      />
    </Box>
  );
};
