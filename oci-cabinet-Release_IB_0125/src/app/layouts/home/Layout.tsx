import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Plugins } from './Plugins';
import { Footer } from './Footer';

export const HomeLayout: React.FC = () => (
  <>
    {/* <Navbar /> */}
    <div>
      <Outlet />
    </div>
    <Plugins />
    {/* <Footer /> */}
  </>
);
