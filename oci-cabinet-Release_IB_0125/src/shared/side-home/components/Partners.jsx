import { Card, Row, Col, Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Partners = () => {
  const { t } = useTranslation();

  return (
    <Card className="main mt-4 p-3 w-100">
      <Card.Body>
        <Col className="d-flex justify-content-center text-center">
          <p style={{ color: '#00AB55' }} className="heading">
            {t('home:partners')}
          </p>
        </Col>
        <Row className="d-flex justify-content-center align-items-baseline mt-4 mb-4">
          <Col xs={6} md={4} className="">
            <Image src="/img/NBK_Logo_1.png" fluid />
          </Col>
          <Col xs={6} md={4} className="mb-2">
            <Image src="/img/image_1.png" fluid />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Partners;
