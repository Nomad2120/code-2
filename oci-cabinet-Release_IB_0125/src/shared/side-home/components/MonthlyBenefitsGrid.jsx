import { useTranslation } from 'react-i18next';
import { Card, Col, Row } from 'react-bootstrap';

export const MonthlyBenefitsGrid = () => {
  const { t } = useTranslation();

  const keys = Array.from({ length: 8 }, (_, index) => index + 1);

  return (
    <>
      <Row className={'row-cols-auto gy-2 mb-3'}>
        {keys.slice(0, 6).map((value, index) => (
          <Col sm={12} md={12} lg={4} key={value} className={'mt-3'}>
            <Card className="monthly-benefit-card mt-2 mb-2 text-start text-lg-center p-1 py-3 h-100">
              <Card.Body className="p-4">
                <div className="d-flex flex-lg-column align-items-center align-items-lg-center justify-content-start justify-content-lg-center">
                  <Card.Img
                    variant="top"
                    src={t(`home:montlybenefits.pic${value}`)}
                    className="me-3 mb-2 mb-lg-4 montly-ben-icons"
                  />
                  <Card.Title className="card-text monthly-ben-titles mb-2 mb-lg-4">
                    <span dangerouslySetInnerHTML={{ __html: t(`home:montlybenefits.title${value}`) }} />
                  </Card.Title>
                </div>
                <Card.Text
                  className="text-content mt-2 mt-lg-0"
                  style={{ lineHeight: '140%', fontSize: '21px', letterSpacing: '1%' }}
                >
                  {t(`home:montlybenefits.text${value}`)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className={'row-cols-auto mb-3'}>
        {keys.slice(6, 8).map((value, index) => (
          <Col sm={12} md={12} lg={6} key={value} className={index && 'mt-3 mt-lg-0'}>
            <Card className="monthly-benefit-card gy-2 mt-2 mb-2 text-start text-lg-center p-1 py-3 h-100">
              <Card.Body className="p-4 h-100">
                <div className="d-flex flex-lg-column align-items-center align-items-lg-center justify-content-start justify-content-lg-center">
                  <Card.Img
                    variant="top"
                    src={t(`home:montlybenefits.pic${value}`)}
                    className="me-3 mb-2 mb-lg-4 montly-ben-icons"
                  />
                  <Card.Title className="card-text monthly-ben-titles mb-2 mb-lg-4">
                    <span dangerouslySetInnerHTML={{ __html: t(`home:montlybenefits.title${value}`) }} />
                  </Card.Title>
                </div>
                <Card.Text
                  className="text-content mt-2 mt-lg-0"
                  style={{ lineHeight: '140%', fontSize: '21px', letterSpacing: '1%' }}
                >
                  {t(`home:montlybenefits.text${value}`)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};
