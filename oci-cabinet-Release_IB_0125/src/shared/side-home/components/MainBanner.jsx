import { Card } from 'react-bootstrap';
import { useScreens } from '@shared/hooks/useScreens';
import Header from './layout/Header';
import MainBannerCard from './MainBannerCard';

const MainBanner = () => {
  const { isMobile } = useScreens();

  return (
    <Card className="coins w-100 mb-2" style={{ position: 'relative', overflow: 'hidden' }}>
      <Card.Body className="p-0 m-0">
        <Header />
        <MainBannerCard />
        {isMobile ? (
          <img src="/img/Background_mobile.png" alt="Mobile Background" className="mobile-background" />
        ) : (
          <img src="/img/home.webp" alt="Home background" className="video-banner" />
        )}
      </Card.Body>
    </Card>
  );
};

export default MainBanner;
