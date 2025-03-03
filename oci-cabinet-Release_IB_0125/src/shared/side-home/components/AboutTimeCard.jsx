import { Button, Card, Col, Image, Row } from 'react-bootstrap';

export const AboutTimeCard = ({ number, title, timestamp, onClick, imgSrc }) => (
  <Card className="monthly-benefit-card about-card-gaps h-100 w-100">
    <Card.Body className="p-2 h-100">
      <Row className="h-100  d-flex justify-content-between p-0 m-0 align-items-center">
        <Col className=" col-8 d-flex align-items-center justify-content-start m-0 p-0">
          <Card.Text className="about-numbers ps-2 pe-2">{number}</Card.Text>
          <Col className="d-xl-block d-none ps-2">
            <Image src={imgSrc} className="about-image" />
          </Col>
          <Col style={{ paddingLeft: '24px' }}>
            <Card.Title className="about-shorts">{title}</Card.Title>
            <Card.Text className="text-content">{timestamp}</Card.Text>
          </Col>
        </Col>
        <Col className="d-flex justify-content-end pe-0">
          <Button variant="success" className="about-btn" onClick={onClick}>
            <Image src="/img/arrow-right.png" alt="btn-about" style={{ padding: 0, margin: 0 }} />
          </Button>
        </Col>
      </Row>
    </Card.Body>
  </Card>
);
