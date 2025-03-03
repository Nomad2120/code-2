import { TutorialModal } from '@shared/side-home/components/TutorialModal';
import MainPage from './components/layout/MainPage';

const SideHome = () => (
  <div className="side-app side-body pt-lg-4 pt-md-4 px-lg-4 px-md-4 px-sm-4">
    <MainPage />
    <TutorialModal />
  </div>
);

export default SideHome;
