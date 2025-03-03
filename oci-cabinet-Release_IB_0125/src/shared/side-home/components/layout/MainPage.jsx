import { InactiveModal } from '@shared/side-home/components/InactiveModal';
import { NotifyModal } from '@shared/side-home/components/NotifyModal';
import PageLayout from './PageLayout';
import MainBanner from '../MainBanner';
import Coins from '../Coins';
import MontlyBenefits from '../MontlyBenefits';
import Partners from '../Partners';
import OurBenefits from '../OurBenefits';
import FAQ from '../FAQ';
import Map from '../Map';
import About from '../About';
import RequestForm from '../RequestForm';
import Footer from './Footer';

const MainPage = () => (
  <PageLayout>
    <MainBanner />
    <About />
    <OurBenefits />
    <Coins />
    <MontlyBenefits />
    <Partners />
    <RequestForm />
    <FAQ />
    <Map />
    <Footer />
    <InactiveModal />
    <NotifyModal />
  </PageLayout>
);
export default MainPage;
