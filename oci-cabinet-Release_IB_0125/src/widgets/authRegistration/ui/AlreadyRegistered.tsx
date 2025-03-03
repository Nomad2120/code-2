import { Link, Typography } from '@mui/material';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import { Link as RouterLink } from 'react-router-dom';
import { PATH_AUTH } from '@app/routes/paths';
import { observer } from 'mobx-react-lite';

export const AlreadyRegistered: React.FC = observer(() => {
  const { translateToken: tt } = useTranslation();
  return (
    <Typography
      variant="body2"
      sx={{
        mt: { md: -2 }
      }}
    >
      <Typography component={'span'}>{`${tt(tokens.register.alreadyRegistered)}?`}&nbsp;</Typography>
      <Link underline="none" variant="subtitle2" component={RouterLink} to={PATH_AUTH.login}>
        <TranslatedToken id={tokens.common.login} />
      </Link>
    </Typography>
  );
});
