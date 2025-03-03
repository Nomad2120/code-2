import { Card, Row, Col, Button } from 'react-bootstrap';
import { config } from '@shared/side-home/config';
import { useNavigate } from 'react-router-dom';
import { BenefitCard } from '@shared/side-home/components/ourBenefits/BenefitCard';
import { useTranslation } from '@shared/utils/i18n';

const OurBenefits = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Card className="main mt-4 mb-3 p-2 w-100">
        <Card.Body>
          <Col className="d-flex justify-content-center text-center">
            <p style={{ color: '#00AB55' }} className="heading">
              {t('home:ourbenefits.heading')}
            </p>
          </Col>
        </Card.Body>
      </Card>
      <Row>
        <Col md={6}>
          <BenefitCard
            image={t('home:ourbenefits.pic1')}
            title={t('home:ourbenefits.title1')}
            text={t('home:ourbenefits.text1')}
            FooterComponent={
              <Button variant="link" href={config.ourBenefits.reports} download className="ourbenefits-download-btns">
                <img
                  src={t('home:faq.picdocument')}
                  alt={'Document Icon'}
                  className="d-none d-md-inline me-1"
                  style={{ width: '28px' }}
                />
                <span>{t(`home:ourbenefits.option1`)}</span>
              </Button>
            }
          />
        </Col>
        <Col md={6}>
          <BenefitCard
            image={t('home:ourbenefits.pic2')}
            title={t('home:ourbenefits.title2')}
            text={t('home:ourbenefits.text2')}
            FooterComponent={
              <div className="w-100">
                <Button
                  variant="link"
                  href={config.ourBenefits.automation.debtor}
                  download
                  className="ourbenefits-download-btns"
                >
                  <img
                    src={t('home:faq.picdocument')}
                    alt="Document Icon"
                    className="d-none d-md-inline me-1"
                    style={{ width: '28px' }}
                  />
                  {t('home:ourbenefits.option2')}
                </Button>
                <Button
                  variant="link"
                  href={config.ourBenefits.automation.notary}
                  download
                  className="ourbenefits-download-btns"
                >
                  <img
                    src={t('home:faq.picdocument')}
                    alt="Document Icon"
                    className="d-none d-md-inline me-1"
                    style={{ width: '28px' }}
                  />
                  {t('home:ourbenefits.option3')}
                </Button>
              </div>
            }
          />
        </Col>
        <Col md={6}>
          <BenefitCard
            image={t('home:ourbenefits.pic3')}
            title={t('home:ourbenefits.title3')}
            text={t('home:ourbenefits.text3')}
            FooterComponent={
              <Button
                variant="link"
                as={'span'}
                href={config.ourBenefits.correction}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('#tutorial');
                }}
                target={'tutorial'}
                rel={'noopener noreferrer'}
                className="ourbenefits-download-btns"
              >
                <img
                  src={t('home:faq.picvideo')}
                  alt={'Video Icon'}
                  className="d-none d-md-inline me-1"
                  style={{ width: '28px' }}
                />
                <span>{t(`home:ourbenefits.video`)}</span>
              </Button>
            }
          />
        </Col>
        <Col md={6}>
          <BenefitCard
            image={t('home:ourbenefits.pic4')}
            title={t('home:ourbenefits.title4')}
            text={t('home:ourbenefits.text4')}
            FooterComponent={
              <Button variant="link" href={config.ourBenefits.invoices} download className="ourbenefits-download-btns">
                <img
                  src={t('home:faq.picdocument')}
                  alt={'Document Icon'}
                  className="d-none d-md-inline me-1"
                  style={{ width: '28px' }}
                />
                <span>{t(`home:ourbenefits.option4`)}</span>
              </Button>
            }
          />
        </Col>
      </Row>
    </>
  );
};

export default OurBenefits;
