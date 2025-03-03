import { useState } from 'react';
import { filter } from 'lodash';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Navigation, Pagination } from 'swiper';
import { styled } from '@mui/material/styles';
import { Box, Card, CardContent, InputAdornment, OutlinedInput, Paper, Stack, Typography } from '@mui/material';
import { useMediaQuery } from 'react-responsive';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { ProfileModule } from '@mobx/services/profile';
import { MotionContainer, MotionInView, varFadeIn } from '../../../shared/components/animate';
import { AppartmentCard } from './AppartmentCard';
import './styles.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

function applyFilter(array: any, query: any) {
  let arr = array;
  if (query) {
    arr = filter(
      array,
      (_item) =>
        _item.address.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _item.flat.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return arr;
}

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 320,
  marginBottom: theme.spacing(2),
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': {
    // @ts-expect-error not typed
    boxShadow: theme.customShadows.z8
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    // @ts-expect-error not typed
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

export const AppartmentList = observer(() => {
  const profileModule = useInjection(ProfileModule);
  const [filter, setFilter] = useState('');
  const { appartments } = profileModule.userData;
  const isMd = useMediaQuery({ minWidth: 900, maxWidth: 1199 });
  const isSm = useMediaQuery({ maxWidth: 899 });
  if (!Array.isArray(appartments) || !appartments.length) return null;
  const filtered = applyFilter(appartments, filter);
  const isNotFound = filtered.length === 0;

  const getSlidesPerView = () => {
    if (isSm) return 1;
    if (isMd) return 2;
    return 3;
  };

  return (
    <>
      {appartments.length > 3 && (
        <SearchStyle
          value={filter}
          onChange={(event) => {
            setFilter(event.target.value);
          }}
          placeholder="Поиск помещений ..."
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
          endAdornment={
            filter ? (
              <InputAdornment position="end" onClick={() => setFilter('')}>
                <Box component={Icon} icon={closeFill} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ) : null
          }
        />
      )}
      {!isNotFound ? (
        <Card sx={{ minHeight: 280 }}>
          <CardContent>
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
                {filtered.map((item: any, idx: number) => (
                  <SwiperSlide key={item.abonentId} className="mySwiperSlider">
                    <MotionInView variants={varFadeIn} sx={{ height: '100%' }}>
                      <AppartmentCard {...item} index={(idx + 4) % 4} />
                    </MotionInView>
                  </SwiperSlide>
                ))}
              </MotionContainer>
            </Swiper>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ height: 280 }}>
          <CardContent sx={{ height: '100%' }}>
            <Paper sx={{ height: '100%' }}>
              <Stack direction="column" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                <Typography gutterBottom align="center" variant="subtitle1">
                  Не найдено
                </Typography>
                <Typography variant="body2" align="center">
                  Нет результата по поиску &nbsp;
                  <strong>&quot;{filter}&quot;</strong>. Попробуйте другое значение для поиска.
                </Typography>
              </Stack>
            </Paper>
          </CardContent>
        </Card>
      )}
    </>
  );
});
