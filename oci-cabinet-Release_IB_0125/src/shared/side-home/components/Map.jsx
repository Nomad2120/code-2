import { Card, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';

const Map = () => {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const [isZoomEnabled, setIsZoomEnabled] = useState(true);

  useEffect(() => {
    const hideElement = () => {
      const mapFrame = document.querySelector('.i4ewOd-pzNkMb-haAclf');
      if (mapFrame) {
        mapFrame.style.display = 'none';
      }
    };

    window.addEventListener('load', hideElement);

    return () => {
      window.removeEventListener('load', hideElement);
    };
  }, []);

  useEffect(() => {
    const disableZoom = () => {
      mapRef.current.children[0].style.pointerEvents = 'none';
      mapRef.current.children[1].classList.add('visible');
    };

    const enableZoom = () => {
      mapRef.current.children[0].style.pointerEvents = 'auto';
      mapRef.current.children[1].classList.remove('visible');
    };

    const onCtrlDown = (event) => {
      if (event.keyCode === 17) {
        enableZoom();
      }
    };

    const onCtrlUp = (event) => {
      if (event.keyCode === 17) {
        disableZoom();
      }
    };

    const onEnter = () => {
      disableZoom();

      window.addEventListener('keydown', onCtrlDown, false);
      window.addEventListener('keyup', onCtrlUp, false);
    };

    const onLeave = () => {
      mapRef.current.children[1].classList.remove('visible');

      window.removeEventListener('keydown', onCtrlDown, false);
      window.removeEventListener('keyup', onCtrlUp, false);
    };

    if (mapRef.current) {
      mapRef.current.addEventListener('pointerenter', onEnter);
      mapRef.current.addEventListener('pointerleave', onLeave);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.removeEventListener('pointerenter', onEnter);
        mapRef.current.removeEventListener('pointerleave', onLeave);
        window.removeEventListener('keydown', onCtrlDown, false);
        window.removeEventListener('keyup', onCtrlUp, false);
      }
    };
  }, []);

  return (
    <Card className="main w-100 mt-4">
      <Card.Body>
        <Row className="justify-content-center text-center align-items-center mb-3">
          <Col>
            <p style={{ color: '#00AB55' }} className="heading">
              {t('home:map.heading')}
            </p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col className="d-flex justify-content-center mb-3 map-iframe relative" ref={mapRef}>
            <iframe
              title={'map'}
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A2ca5173cbb499db65939c99d876acdd2f58a54b51cb53dedd1e1b1e14225aa8a&amp;source=constructor"
              width="100%"
              allowFullScreen
            />
            <div className={'map-overlay'}>
              <span>{t('home:map.zoomChangeGuide')}</span>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Map;
