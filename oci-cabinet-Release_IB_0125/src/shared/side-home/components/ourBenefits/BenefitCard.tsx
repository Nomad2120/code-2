import { observer } from 'mobx-react-lite';
import { Card, Col, Row } from 'react-bootstrap';
import { ReactNode } from 'react';

interface Props {
  image: string;
  title: string;
  text: string;
  FooterComponent: ReactNode;
}

export const BenefitCard: React.FC<Props> = observer(({ image, title, text, FooterComponent }) => (
  <Card className="main mb-3 p-1 w-100">
    <Card.Body className="px-4 pt-3 pb-3">
      <Row>
        <Col xs={3} md={3} lg={3} className="d-flex justify-content-center align-items-center">
          <Card.Img variant="top" src={image} className="our-benefits-img" />
        </Col>
        <Col xs={9} md={9} lg={9} className="d-flex align-items-center">
          <div>
            <Card.Title>
              <p className="our-benefits-heading">{title}</p>
            </Card.Title>
            <Card.Text
              style={{
                lineHeight: '140%',
                fontSize: '21px',
                letterSpacing: '1%'
              }}
            >
              {text}
            </Card.Text>
          </div>
        </Col>
        <Col
          xs={12}
          md={12}
          lg={12}
          className={`d-flex align-items-center our-benefits-btn-block mt-2 p-0 justify-content-start`}
        >
          <div className="d-flex align-items-center">{FooterComponent}</div>
        </Col>
      </Row>
    </Card.Body>
  </Card>
));
