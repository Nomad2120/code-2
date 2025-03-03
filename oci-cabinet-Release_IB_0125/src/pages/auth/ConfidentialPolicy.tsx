import { observer } from 'mobx-react-lite';
import { Typography } from '@mui/material';
import { useTranslation } from '@shared/utils/i18n';

export const ConfidentialPolicy: React.FC = observer(() => {
  const { t } = useTranslation();

  return (
    <Typography variant="caption" align="center" sx={{ color: 'text.secondary', mt: 2, fontSize: '0.55rem' }}>
      {t('auth:register.offer')}
      <span>
        <a
          download
          style={{ color: 'inherit', textDecoration: 'underline' }}
          href={t('auth:register.policyFile')}
        >{`${t('auth:register.policyLink')}`}</a>
      </span>
      {t('auth:register.afterPolicy')}
    </Typography>
  );
});
