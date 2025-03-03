import { Card, CardContent } from '@mui/material';
import { Mousewheel, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useInjection } from 'inversify-react';
import { OsiCard } from '@entities/cabinet/osiCard';
import { useMediaQuery } from 'react-responsive';
import { observer } from 'mobx-react-lite';
import { OsiListViewModel } from '@widgets/osiList/model';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { MotionContainer, MotionInView, varFadeIn } from '@/shared/components/animate';

export const Osis = observer((): JSX.Element => {
  const viewModel = useInjection(OsiListViewModel);
  const isMd = useMediaQuery({ minWidth: 900, maxWidth: 1199 });
  const isSm = useMediaQuery({ maxWidth: 899 });

  const getSlidesPerView = () => {
    if (isSm) return 1;
    if (isMd) return 2;
    return 3;
  };

  return (
    <Card sx={{ height: 280 }}>
      <CardContent
        className="h-full osis-wrapper"
        sx={(theme) => ({
          background: `linear-gradient(40deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.light} 65%, ${
            (theme.palette.primary as any).lighter
          } 100%)`
        })}
      >
        <Swiper
          className="mySwiper h-full"
          slidesPerView={getSlidesPerView()}
          spaceBetween={15}
          hashNavigation={{
            watchState: true
          }}
          pagination={
            isSm
              ? false
              : {
                  dynamicBullets: true,
                  dynamicMainBullets: 6,
                  clickable: true
                }
          }
          navigation
          mousewheel
          modules={[Navigation, Pagination, Mousewheel]}
        >
          <MotionContainer open initial="initial" sx={{ overflow: 'hidden' }}>
            {viewModel.getOsis().map((osi) => (
              <SwiperSlide key={osi.id} className="mySwiperSlider">
                <MotionInView variants={varFadeIn} sx={{ height: '100%' }} transition={undefined} threshold={undefined}>
                  <OsiCard osi={osi} />
                </MotionInView>
              </SwiperSlide>
            ))}
          </MotionContainer>
        </Swiper>
      </CardContent>
    </Card>
  );
});
