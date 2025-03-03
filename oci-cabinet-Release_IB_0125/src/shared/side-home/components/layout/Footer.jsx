import { Card, Row, Col, Container, Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useRef } from 'react';
import { useScreens } from '@shared/hooks/useScreens';

const Footer = () => {
  const { isMobile } = useScreens();
  const { t } = useTranslation();
  const footerRef = useRef(null);

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

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  const render = useCallback(() => {
    if (isMobile) {
      return (
        <>
          <Col xs={12} md={8} lg={9} xl={10} className="d-flex justify-content-center text-center align-items-center">
            <Card.Text className="text-content p-3 w-100 info-footer"> {t('home:contacts.info')}</Card.Text>
          </Col>
          <Col xs={12} md={4} lg={3} xl={2} className="text-center text-xl-start footer-first-column mt-2">
            <Card.Text style={{ fontWeight: '700', fontSize: '21px' }}>+7 (707) 682-56-76</Card.Text>
            <Card.Text
              className="d-flex justify-content-center justify-content-xl-start align-items-center"
              style={{ color: '#9A9A9A', fontSize: '18px' }}
            >
              <Image
                src={t('home:contacts.phone_label')}
                alt="Phone"
                className="me-2 d-flex align-items-center footer-img"
                style={{ width: '24px', height: '24px' }}
              />
              <span>{t('home:contacts.phone')}</span>
            </Card.Text>
          </Col>
        </>
      );
    }

    return (
      <>
        <Col xs={12} md={4} lg={3} xl={2} className="text-center text-xl-start footer-first-column">
          <Card.Text style={{ fontWeight: '700', fontSize: '21px' }}>+7 (707) 682-56-76</Card.Text>
          <Card.Text
            className="d-flex justify-content-center justify-content-xl-start align-items-center"
            style={{ color: '#9A9A9A', fontSize: '18px' }}
          >
            <Image
              src={t('home:contacts.phone_label')}
              alt="Phone"
              className="me-2 d-flex align-items-center footer-img"
              style={{ width: '24px', height: '24px' }}
            />
            <span>{t('home:contacts.phone')}</span>
          </Card.Text>
        </Col>
        <Col xs={12} md={8} lg={9} xl={10} className="d-flex justify-content-center text-center align-items-center">
          <Card.Text className="text-content p-3 w-100 info-footer"> {t('home:contacts.info')}</Card.Text>
        </Col>
      </>
    );
  }, [isMobile]);

  return (
    <Card ref={footerRef} className="main mt-4 p-4 w-100" id={'footer'}>
      <Card.Body className="p-0">
        <Container>
          <Row className="d-flex justify-content-center align-items-center">{render()}</Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default Footer;
