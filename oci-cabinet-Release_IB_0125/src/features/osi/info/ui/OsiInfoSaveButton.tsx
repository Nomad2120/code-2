import { observer } from 'mobx-react-lite';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';

interface Props {
  loading: boolean;
  disabled: boolean;
}

export const OsiInfoSaveButton: React.FC<Props> = observer(({ loading, disabled }) => {
  const { t } = useTranslation();

  return (
    <LoadingButton data-test-id={'osi-save'} type="submit" variant="contained" loading={loading} disabled={disabled}>
      {t('common:save')}
    </LoadingButton>
  );
});
