import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Button, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useScreens } from '@shared/hooks/useScreens';
import { useInjection } from 'inversify-react';
import { ContactService } from '@shared/side-home/model/ContactService';
import PopUpModal from './Modal';

const MainBannerCard = () => {
  const { t } = useTranslation();
  const [activeButton, setActiveButton] = useState(null);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const { isMobile } = useScreens();
  const cardRef = useRef(null);

  const contactService = useInjection(ContactService);

  useEffect(() => {
    const cb = ([entry]) => {
      if (!isMobile) return;

      const widget = document.getElementById('wa-widget');

      if (entry.isIntersecting) {
        widget.style.visibility = 'hidden';
      } else {
        widget.style.visibility = 'visible';
      }
    };

    const observer = new IntersectionObserver(cb);

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const handleButtonClick = (index) => {
    if (activeButton === index) {
      setActiveButton(null);
      setAnimationStarted(false);
    } else {
      setActiveButton(index);
      setAnimationStarted(true);
    }
  };

  const showModal = () => {
    if (contactService.abonentType !== 'abonent') {
      setModalShow(true);
      return;
    }

    contactService.disallowAbonentSending();
  };

  return (
    <Card ref={cardRef} className="main-banner-card">
      <Card.Body className="p-0">
        <Container>
          <Row xs={1} md={1}>
            <Col lg={6} className="heading-wrapper px-4 mt-auto mb-auto">
              <Col className="mb-3 p-0">
                <p className="heading" style={{ textTransform: 'none', lineHeight: '1.2' }}>
                  {t('home:mainBanner.heading')}
                </p>
              </Col>
              <Col className="main-banner-btn-contactUs d-none d-lg-block">
                <Button
                  variant="custom"
                  id="contactUs"
                  onClick={showModal}
                  className="w-lg-50 w-md-100 w-xs-100 m-0 contactUsMainBanner"
                >
                  {t('home:btn.contactUs')}
                </Button>
                <PopUpModal show={modalShow} onHide={() => setModalShow(false)} />
              </Col>
            </Col>
            <Col lg={6} className="fill px-0" style={{ height: '396px', maxHeight: 'auto' }}>
              <div className="d-flex flex-wrap align-items-center main-banner-btns-container">
                <p
                  style={{ fontSize: '18px', fontWeight: '700', lineHeight: '1.3' }}
                  className="main-banner-btns-title"
                  dangerouslySetInnerHTML={{ __html: t('home:mainBanner.btntitle') }}
                />
                {['btn1', 'btn2', 'btn3', 'btn4'].map((key, index) => (
                  <Button
                    type={'button'}
                    key={index}
                    className="btn btn-lg"
                    id="bannerBtns"
                    style={{
                      backgroundColor: activeButton === index + 1 ? '#161C24' : '#F6F6F6',
                      color: activeButton === index + 1 ? 'white' : '#000000'
                    }}
                    onClick={() => handleButtonClick(index + 1)}
                  >
                    {t(`home:mainBanner.${key}`)}
                  </Button>
                ))}
              </div>
              {pageLoaded &&
                ['btn1', 'btn2', 'btn3', 'btn4'].map((key, index) => (
                  <Card.Text
                    key={index}
                    className={`${activeButton === index + 1 && animationStarted ? 'slide-in' : ''} ${
                      activeButton === index + 1 ? 'custom-text' : ''
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: activeButton === index + 1 ? t(`home:mainBanner.${key}text${index + 1}`) : ''
                    }}
                  />
                ))}
              {!activeButton && (
                <Card.Text
                  dangerouslySetInnerHTML={{ __html: t('home:mainBanner.btntext') }}
                  className={`d-md-inline d-lg-inline d-xl-inline d-xxl-inline ${
                    !activeButton && !animationStarted ? 'slide-in' : ''
                  }`}
                />
              )}
            </Col>
            <Col className="main-banner-btn-contactUs d-lg-none">
              <Button
                variant="custom"
                id="contactUs"
                onClick={() => setModalShow(true)}
                className="w-lg-50 w-md-100 w-xs-100 m-0"
              >
                {t('home:btn.contactUs')}
              </Button>
              <PopUpModal show={modalShow} onHide={() => setModalShow(false)} />
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default MainBannerCard;
