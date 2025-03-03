import { Col, Row } from 'react-bootstrap';
import { AboutTimeCard } from '@shared/side-home/components/AboutTimeCard';
import { useTranslation } from 'react-i18next';

export const AboutTimingsGrid = ({ videoRef }) => {
  const { t } = useTranslation();

  const numbers = ['01', '02', '03', '04', '05', '06'];

  const handleTimeJump = (time) => {
    if (videoRef.current) {
      videoRef.current.src = `https://www.youtube.com/embed/TgJQ9jjonzQ?autoplay=1&controls=1&showinfo=0&rel=0&start=${time}`;
      videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  const jumpTimes = [24, 48, 83, 113, 139, 176];

  return (
    <Row className="about-container mb-4 row-cols-1 row-cols-md-2">
      {numbers.map((key, index) => {
        const number = numbers[index];
        const time = jumpTimes[index];

        return (
          <Col className={'gy-2'} md={6} key={key}>
            <AboutTimeCard
              key={0}
              number={number}
              imgSrc={t(`home:about.pic${number}`)}
              title={t(`home:about.short${number}`)}
              timestamp={t(`home:about.timestamp${number}`)}
              onClick={() => handleTimeJump(time)}
            />
          </Col>
        );
      })}
    </Row>
  );
};
