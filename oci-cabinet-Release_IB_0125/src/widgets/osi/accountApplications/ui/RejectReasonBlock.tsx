import { observer } from 'mobx-react-lite';
import { useTranslation } from '@shared/utils/i18n';
import { Box, Typography } from '@mui/material';

interface Props {
  reasonText: string;
}

export const RejectReasonBlock: React.FC<Props> = observer(({ reasonText }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant={'subtitle1'}>{t('accountApplications:fullInfo.rejectText')}</Typography>
      <Typography>{reasonText}</Typography>
    </Box>
  );
});
