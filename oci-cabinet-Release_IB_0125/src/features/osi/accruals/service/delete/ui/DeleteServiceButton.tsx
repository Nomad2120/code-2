import { observer } from 'mobx-react-lite';
import DialogIconButton from '@shared/common/DialogIconButton';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';
import { setStateOsiService } from '@shared/api/osiServices/setState';
import { useTranslation } from '@shared/utils/i18n';

interface Props {
  serviceId: number | undefined;
  content: string;
  reloadCb: any;
  onSuccess: () => void;
}

export const DeleteServiceButton: React.FC<Props> = observer(({ serviceId, content, reloadCb, onSuccess }) => {
  const { t } = useTranslation();

  const deleteHandler = async () => {
    try {
      if (!serviceId) {
        throw new Error('service id undefined');
      }

      await setStateOsiService(serviceId, false);
      reloadCb?.();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      onSuccess();
    }
  };

  return (
    // @ts-expect-error component not typed
    <DialogIconButton
      className={'mr-auto'}
      label={t('common:del')}
      color="error"
      title={t('accruals:deleteService')}
      content={content}
      onAgree={deleteHandler}
    />
  );
});
