import { useInjection } from 'inversify-react';
import { ContactService } from '@shared/side-home/model/ContactService';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';

export const NotifyModal = observer(() => {
  const contactService = useInjection(ContactService);
  const { t } = useTranslation();

  const notifyMessage = useMemo(() => {
    if (contactService.isError) {
      if (contactService.errType === 'wrongAbonentType') {
        return <div className={'content-text'}>{t('home:request.notify.abonentType')}</div>;
      }
      return <div className={'content-text'} dangerouslySetInnerHTML={{ __html: t('home:request.notify.error') }} />;
    }

    return <p className={'content-text'}>{t('home:request.notify.success')}</p>;
  }, [contactService.errType, contactService.isError, t]);

  return (
    <Modal
      dialogClassName={'notify-modal'}
      centered
      show={contactService.isNotifyOpen}
      onHide={contactService.closeNotify}
    >
      <Modal.Header closeButton />
      <Modal.Body>
        <div className={'text-black text-center'}>{notifyMessage}</div>
      </Modal.Body>
    </Modal>
  );
});
