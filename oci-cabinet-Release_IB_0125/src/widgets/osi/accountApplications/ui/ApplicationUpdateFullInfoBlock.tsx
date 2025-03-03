import { Box, Typography } from '@mui/material';
import { useTranslation } from '@shared/utils/i18n';
import { OsiAccountApplication } from '@shared/types/osiAccountApplications';
import { observer } from 'mobx-react-lite';

interface Props {
  application: OsiAccountApplication | null;
}

export const ApplicationUpdateFullInfoBlock: React.FC<Props> = observer(({ application }) => {
  const { t, fieldWithPrefix: fwp } = useTranslation();

  if (!application) return null;

  return (
    <Box>
      <Typography variant={'subtitle1'}>{t('accountApplications:fullInfo.update.header')}</Typography>
      <Typography>
        {t('accountApplications:fullInfo.update.accountChange', {
          oldAccount: application?.oldAccount,
          newAccount: application?.account
        })}
      </Typography>
      <Typography>
        {t('accountApplications:fullInfo.update.accountType', { accountType: fwp(application, 'accountTypeName') })}
      </Typography>
      <Typography>
        {t('accountApplications:fullInfo.update.accountBicChange', {
          oldBic: application.oldBankBic,
          newBic: application?.bic
        })}
      </Typography>
    </Box>
  );
});
