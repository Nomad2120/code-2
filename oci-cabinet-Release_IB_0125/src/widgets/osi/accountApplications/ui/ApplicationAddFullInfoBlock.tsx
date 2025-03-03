import { Box, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { OsiAccountApplication } from '@shared/types/osiAccountApplications';
import { useTranslation } from '@shared/utils/i18n';

interface Props {
  application: OsiAccountApplication | null;
}

export const ApplicationAddFullInfoBlock: React.FC<Props> = observer(({ application }) => {
  const { t, fieldWithPrefix: fwp } = useTranslation();

  if (!application) return null;

  return (
    <Box>
      <Typography variant={'subtitle1'}>{t('accountApplications:fullInfo.create.header')}</Typography>
      <Typography>{t('accountApplications:fullInfo.create.account', { account: application?.account })}</Typography>
      <Typography>
        {t('accountApplications:fullInfo.create.accountType', { accountType: fwp(application, 'accountTypeName') })}
      </Typography>
      <Typography>{t('accountApplications:fullInfo.create.bic', { bic: application?.bic })}</Typography>
    </Box>
  );
});
