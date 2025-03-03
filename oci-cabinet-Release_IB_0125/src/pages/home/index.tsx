import { Helmet } from 'react-helmet-async';
import SideHome from '@shared/side-home/App';

const PAGE_TITLE = 'Кабинет ОСИ';

export const HomePage: React.FC = () => (
  <>
    <Helmet>
      <title>{PAGE_TITLE}</title>
    </Helmet>
    <SideHome />
  </>
);

export default HomePage;
