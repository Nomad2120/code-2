import { Box, Popover, Typography } from '@mui/material';
import React, { useState } from 'react';
import Label from '@shared/components/Label';
import { useTheme } from '@mui/material/styles';
import { observer } from 'mobx-react-lite';
import { useTranslation } from '@shared/utils/i18n';
import { OsiServiceResponse } from '@shared/types/osi/services';

interface Props {
  service: OsiServiceResponse;
}

export const ServiceStatus: React.FC<Props> = observer(({ service }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [hover, setHover] = useState(null);

  const handleHoverOpen = (event: any) => {
    setHover(event.currentTarget);
  };
  const handleHoverClose = () => {
    setHover(null);
  };

  const { isActive } = service;

  const errors = [];
  if (!service.amount) errors.push(t('accruals:validation.tariff.empty'));

  if (service.countActiveAbonents === 0) {
    errors.push(t('accruals:validation.abonents.empty'));
  }

  const success = errors.length === 0;

  const printLabelText = () => {
    if (!isActive) return t('accruals:status.inactive');
    if (!success) return t('accruals:status.notReady');

    return t('accruals:status.ready');
  };

  const getLabelColor = () => {
    if (!isActive) return 'info';
    if (!success) return 'error';

    return 'success';
  };

  return (
    <>
      <Label
        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
        color={getLabelColor()}
        aria-owns={hover ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handleHoverOpen}
        onMouseLeave={handleHoverClose}
      >
        {printLabelText()}
      </Label>
      {isActive && !success && (
        <Popover
          id="mouse-over-popover"
          sx={{ pointerEvents: 'none' }}
          open={Boolean(hover)}
          anchorEl={hover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          onClose={handleHoverClose}
          disableRestoreFocus
        >
          <Box sx={{ p: 2, maxWidth: 280 }}>
            {errors.map((x, i) => (
              <Typography variant="body1" key={i}>
                - {x}
              </Typography>
            ))}
          </Box>
        </Popover>
      )}
    </>
  );
});
