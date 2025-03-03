import { useRef } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { AboutTimingsGrid } from '@shared/side-home/components/AboutTimingsGrid';

const About = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);

  const aboutTextHtml = { __html: t('home:about.text') };

  return (
    <Card className="main w-100 mb-4 mt-4">
      <Card.Body className="p-0">
        <Row>
          <Col className="d-flex justify-content-center mb-4 mt-4">
            <p style={{ color: '#00AB55' }} className="heading">
              {t('home:about.heading')}
            </p>
          </Col>
        </Row>
        <Row className="justify-content-between about-container">
          <Col sm={12} md={12} lg={6} className="order-lg-last d-flex justify-content-center align-items-center">
            <div className="img-video">
              <iframe
                ref={videoRef}
                className="embed-responsive embed-responsive-16by9"
                src="https://www.youtube.com/embed/TgJQ9jjonzQ?autoplay=0&controls=1&showinfo=0&modestbranding=1&rel=0"
                title="YouTube video player"
                allowFullScreen
              />
            </div>
          </Col>
          <Col sm={12} md={12} lg={6} className="mt-4 d-flex align-items-center">
            <div>
              <p className="mb-4 about-title">{t(`home:about.title`)}</p>
              <Card.Text
                dangerouslySetInnerHTML={aboutTextHtml}
                style={{ lineHeight: '1.2', marginBottom: '10px', fontSize: '22px' }}
              />
            </div>
          </Col>
        </Row>
        <AboutTimingsGrid videoRef={videoRef} />
      </Card.Body>
    </Card>
  );
};

export default About;
