import { Card, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { MonthlyBenefitsGrid } from '@shared/side-home/components/MonthlyBenefitsGrid';

const MontlyBenefits = () => {
  const { t } = useTranslation();

  const keys = Array.from({ length: 8 }, (_, index) => index + 1);

  return (
    <Card className="main p-3 w-100">
      <Card.Body className="pb-2">
        <Col className="d-flex justify-content-center text-center mb-4">
          <p style={{ color: '#00AB55' }} className="heading">
            {t('home:montlybenefits.heading')}
          </p>
        </Col>

        <MonthlyBenefitsGrid />

        {/* <Row> */}
        {/*  {keys.slice(0, 3).map((key) => ( */}
        {/*    <Col sm={12} md={12} lg={4} key={key}> */}
        {/*      <Card className="monthly-benefit-card mt-2 mb-2 text-start text-lg-center p-1"> */}
        {/*        <Card.Body className="p-4"> */}
        {/*          <div className="d-flex flex-lg-column align-items-center align-items-lg-center justify-content-start justify-content-lg-center"> */}
        {/*            <Card.Img */}
        {/*              variant="top" */}
        {/*              src={t(`home:montlybenefits.pic${key}`)} */}
        {/*              className="me-3 mb-2 mb-lg-4 montly-ben-icons" */}
        {/*            /> */}
        {/*            <Card.Title className="card-text monthly-ben-titles mb-2 mb-lg-4"> */}
        {/*              <span dangerouslySetInnerHTML={{ __html: t(`home:montlybenefits.title${key}`) }} /> */}
        {/*            </Card.Title> */}
        {/*          </div> */}
        {/*          <Card.Text */}
        {/*            className="text-content mt-2 mt-lg-0" */}
        {/*            style={{ lineHeight: '140%', fontSize: '21px', letterSpacing: '1%' }} */}
        {/*          > */}
        {/*            {t(`home:montlybenefits.text${key}`)} */}
        {/*          </Card.Text> */}
        {/*        </Card.Body> */}
        {/*      </Card> */}
        {/*    </Col> */}
        {/*  ))} */}
        {/* </Row> */}
        {/* <Row> */}
        {/*  {keys.slice(3, 6).map((key) => ( */}
        {/*    <Col sm={12} md={12} lg={4} key={key}> */}
        {/*      <Card className="monthly-benefit-card mt-2 mb-2  text-start text-lg-center p-1"> */}
        {/*        <Card.Body className="p-4"> */}
        {/*          <div className="d-flex flex-lg-column align-items-center align-items-lg-center justify-content-start justify-content-lg-center"> */}
        {/*            <Card.Img */}
        {/*              variant="top" */}
        {/*              src={t(`home:montlybenefits.pic${key}`)} */}
        {/*              className="me-3 mb-2 mb-lg-4 montly-ben-icons" */}
        {/*            /> */}
        {/*            <Card.Title className="card-text monthly-ben-titles mb-2 mb-lg-4"> */}
        {/*              <span dangerouslySetInnerHTML={{ __html: t(`home:montlybenefits.title${key}`) }} /> */}
        {/*            </Card.Title> */}
        {/*          </div> */}
        {/*          <Card.Text */}
        {/*            className="text-content mt-2 mt-lg-0" */}
        {/*            style={{ lineHeight: '140%', fontSize: '21px', letterSpacing: '1%' }} */}
        {/*          > */}
        {/*            {t(`home:montlybenefits.text${key}`)} */}
        {/*          </Card.Text> */}
        {/*        </Card.Body> */}
        {/*      </Card> */}
        {/*    </Col> */}
        {/*  ))} */}
        {/* </Row> */}
        {/* <Row> */}
        {/*  {keys.slice(6, 8).map((key) => ( */}
        {/*    <Col sm={12} md={12} lg={6} key={key}> */}
        {/*      <Card className="monthly-benefit-card mt-2 mb-2 text-start text-lg-center p-1"> */}
        {/*        <Card.Body className="p-4"> */}
        {/*          <div className="d-flex flex-lg-column align-items-center align-items-lg-center justify-content-start justify-content-lg-center"> */}
        {/*            <Card.Img */}
        {/*              variant="top" */}
        {/*              src={t(`home:montlybenefits.pic${key}`)} */}
        {/*              className="me-3 mb-2 mb-lg-4 montly-ben-icons" */}
        {/*            /> */}
        {/*            <Card.Title className="card-text monthly-ben-titles mb-2 mb-lg-4"> */}
        {/*              {t(`home:montlybenefits.title${key}`)} */}
        {/*            </Card.Title> */}
        {/*          </div> */}
        {/*          <Card.Text */}
        {/*            className="text-content mt-2 mt-lg-0" */}
        {/*            style={{ lineHeight: '140%', fontSize: '21px', letterSpacing: '1%' }} */}
        {/*          > */}
        {/*            {t(`home:montlybenefits.text${key}`)} */}
        {/*          </Card.Text> */}
        {/*        </Card.Body> */}
        {/*      </Card> */}
        {/*    </Col> */}
        {/*  ))} */}
        {/* </Row> */}
      </Card.Body>
    </Card>
  );
};

export default MontlyBenefits;
