import { observer } from 'mobx-react-lite';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Form, Card } from 'react-bootstrap';
import { useInjection } from 'inversify-react';
import { ContactService } from '@shared/side-home/model/ContactService';
import { useTranslation } from '@shared/utils/i18n';
import { clsx } from 'clsx';

export const AbonentTypeModal = observer(() => {
  const { t } = useTranslation();
  const contactService = useInjection(ContactService);

  const changeHandler = (e) => {
    contactService.abonentType = e.target.value;
  };

  return (
    <Modal
      size={'sm'}
      show={contactService.isShowAbonentTypeModal}
      centered
      aria-labelledby="abonent-type-vcentered-modal"
      className={'abonent-type-modal'}
    >
      <Modal.Header closeButton />
      <Modal.Body>
        <Card className={'border-0'}>
          <Card.Body className={'grid flex-col justify-center items-center'}>
            <Card.Text className={'font-bold uppercase text-center text-xl text-[#00AB55] mb-2'}>
              {t('home:request.abonentTypeModal.cardHeading')}
            </Card.Text>
            <Form className={'text-black grid grid-rows-1'}>
              <Form.Group controlId={'abonent_type'} className={'grid grid-rows-2 gap-y-1'}>
                <Form.Check
                  onChange={changeHandler}
                  className={clsx('abonent-type-check', contactService.abonentType === 'abonent' && 'checked')}
                  type="radio"
                  id={'abonent_type_abonent'}
                  label={t('home:request.abonentTypeModal.abonent')}
                  checked={contactService.abonentType === 'abonent'}
                  value={'abonent'}
                />
                <Form.Check
                  onChange={changeHandler}
                  className={clsx('abonent-type-check', contactService.abonentType === 'chairman' && 'checked')}
                  type="radio"
                  id={'abonent_type_chairman'}
                  label={t('home:request.abonentTypeModal.chairman')}
                  checked={contactService.abonentType === 'chairman'}
                  value={'chairman'}
                />
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="custom"
          id="send-request"
          className="w-100 mt-0"
          disabled={contactService.abonentType === '' || contactService.isLoading}
          style={{ backgroundColor: contactService.abonentType !== '' ? '#00AB55' : '#CCCCCC' }}
          onClick={contactService.approveAbonentType}
        >
          {t('home:btn.sendrequest')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});
