import { useState, useEffect } from 'react';
import { Card, Row, Col, Image, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import MaskedFormControl from 'react-bootstrap-maskedinput';
import { useInjection } from 'inversify-react';
import { ContactService } from '@shared/side-home/model/ContactService';

const RequestForm = () => {
  const { t } = useTranslation();
  const contactService = useInjection(ContactService);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [formValid, setFormValid] = useState(false);

  const handleSubmit = async (event) => {
    setFormValid(false);
    await contactService.sendCallBackData({
      name,
      phone,
      afterInactivity: false
    });
    setName('');
    setPhone('');
    event.preventDefault();
    event.stopPropagation();
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePhoneFocus = () => {
    if (!phone.startsWith('+7') && !phone.startsWith('7')) {
      setPhone(`+7${phone}`);
    }
  };
  const handlePhoneChange = (event) => {
    let newPhone = event.target.value;
    if (!newPhone.startsWith('+7')) {
      newPhone = `+7${newPhone.substring(2)}`;
    }
    setPhone(newPhone);
  };

  useEffect(() => {
    checkFormValidity();
  }, [name, phone]);

  const checkFormValidity = () => {
    const phoneRegex = /^(?:\+7|7) \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/;
    if (name && name.trim() !== '' && phone && phone.trim().match(phoneRegex)) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  return (
    <Card className="main mt-4 mb-4 w-100" style={{ backgroundColor: '#F6F6F6' }} id="requestForm">
      <Card.Body className="p-0 position-relative">
        <Row className="justify-content-between m-0">
          <Col lg={4} className="d-none d-lg-block p-0 me-4">
            <div className="d-flex justify-content-center">
              <Image src="/img/Frame_35.png" fluid className="request-form-img" />
            </div>
          </Col>
          <Col className="main d-flex justify-content-center align-items-center">
            <div className="request-form-container">
              <Col className="d-flex justify-content-center text-center">
                <p style={{ color: '#00AB55' }} className="heading mt-4">
                  {t('home:request.heading')}
                </p>
              </Col>
              <Card.Text className="d-flex justify-content-center text-center mx-auto request-form-text">
                {t('home:request.text')}
              </Card.Text>
              <Form className="mt-4">
                <Form.Group controlId="formName">
                  <div className="request-form-icon-input-wrapper">
                    <div className="request-form-icon-wrapper">
                      <Image src="\img\user.png" alt="User Icon" className="request-form-icon" />
                    </div>
                    <Form.Control
                      type="text"
                      placeholder={t('home:request.placeholderName')}
                      value={name}
                      onChange={handleNameChange}
                      className="form-submit"
                    />
                  </div>
                </Form.Group>
                <Form.Group controlId="formPhone">
                  <div className="request-form-icon-input-wrapper">
                    <div className="request-form-icon-wrapper">
                      <Image src="\img\call_11.png" alt="User Icon" className="request-form-icon" />
                    </div>
                    <MaskedFormControl
                      type="text"
                      placeholder={t('home:request.placeholderPhone')}
                      value={phone}
                      onFocus={handlePhoneFocus}
                      onChange={handlePhoneChange}
                      className="form-submit"
                      mask="+7 (111) 111-11-11"
                    />
                  </div>
                </Form.Group>
                <Button
                  variant="custom"
                  id="send-request"
                  className="w-100 mt-0"
                  disabled={!formValid}
                  style={{ backgroundColor: formValid ? '#00AB55' : '#CCCCCC' }}
                  onClick={handleSubmit}
                >
                  {t('home:btn.sendrequest')}
                </Button>
                <div className="d-flex justify-content-center align-items-center text-center mx-auto mb-4">
                  <Card.Text className="d-inline request-form-info-text">
                    {t('home:request.info.beforeLink')}
                    <span>
                      <a href={t('home:nda.file')} download style={{ color: 'inherit', textDecoration: 'underline' }}>
                        {t('home:request.info.linkText')}
                      </a>
                    </span>
                  </Card.Text>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default RequestForm;
