import React from 'react';
import { Card, Row, Col, Button, Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useInjection } from 'inversify-react';
import { ContactService } from '@shared/side-home/model/ContactService';
import PopUpModal from './Modal';

const Coins = () => {
  const { t } = useTranslation();
  const [modalShow, setModalShow] = React.useState(false);
  const contactService = useInjection(ContactService);

  const showModal = () => {
    if (contactService.abonentType !== 'abonent') {
      setModalShow(true);
      return;
    }

    contactService.disallowAbonentSending();
  };

  return (
    <Card className="coins mb-4 w-100">
      <Card.Body>
        <Row className="d-flex justify-content-center align-items-center">
          <Col xs={12} md={3} lg={2} xl={2} className="text-center">
            <div className="img-coins mx-auto ">
              <Image src="/img/stack_of_coins.png" alt="coins-img" fluid />
            </div>
          </Col>
          <Col xs={12} md={8} lg={6} xl={7} className="text-center text-md-start mb-3 mt-3">
            <div>
              <Card.Title>
                <p className="heading p-0 mb-2" style={{ fontSize: '32px', fontWeight: '700' }}>
                  {t('home:coins.heading')}
                </p>
              </Card.Title>
              <Card.Text style={{ lineHeight: '140%', fontSize: '21px', letterSpacing: '1%' }}>
                {t('home:coins.text')}
              </Card.Text>
            </div>
          </Col>
          <Col xs={12} md={12} lg={4} xl={3}>
            <div className="d-flex justify-content-end justify-content-sm-center">
              <Button variant="custom" id="contactUs" className="mt-0 contactUsCoins" onClick={showModal}>
                {t('home:btn.contactUs')}
              </Button>
              <PopUpModal show={modalShow} onHide={() => setModalShow(false)} />
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Coins;
