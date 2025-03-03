import { observer } from 'mobx-react-lite';
import { Box, Button, Dialog, DialogContent, DialogTitle, Link, Typography } from '@mui/material';
import { useTranslation } from '@shared/utils/i18n';
import { Trans } from 'react-i18next';
import { Icon } from '@iconify/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onFreeClick: () => void;
  onFullClick: () => void;
}

const instructionLink = 'https://www.youtube.com/watch?v=RFIgTdEQ4A0';

export const SelectTypeRegistration: React.FC<Props> = observer(({ isOpen, onClose, onFreeClick, onFullClick }) => {
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={'sm'}>
      <Button
        sx={{
          position: 'absolute',
          left: 10,
          top: 20
        }}
        variant={'outlined'}
        onClick={onClose}
      >
        {t('common:back')}
      </Button>
      <DialogTitle
        sx={{
          mt: 6,
          py: 2,
          px: 2
        }}
      >
        <Typography variant={'subtitle1'} align={'center'}>
          <Trans
            i18nKey={'registration:title'}
            t={t}
            components={{
              Link: (
                <Link
                  target={'_blank'}
                  rel={'noopener'}
                  underline={instructionLink ? 'always' : 'none'}
                  href={instructionLink}
                />
              ),
              Icon: <Icon icon={'logos:youtube-icon'} style={{ display: 'inline', marginLeft: '5px' }} />
            }}
          />
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            my: 3
          }}
        >
          <Button sx={{ width: '50%' }} variant="outlined" onClick={onFullClick}>
            {t('registration:fullVersion', { price: 100, currency: 'Тг/Кв' })}
          </Button>
          <Button sx={{ width: '50%' }} variant="outlined" onClick={onFreeClick}>
            {t('registration:reports')}
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant={'caption'} align={'center'}>
            {t('registration:subtitle')}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
});
