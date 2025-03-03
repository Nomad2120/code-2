import { useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import LoadingScreen from '@shared/components/LoadingScreen';

const Loadable = (Component: any): any => {
  const Render = (props: any) => {
    const { pathname } = useLocation();
    const isDashboard = pathname.includes('/dashboard');

    return (
      <Suspense
        fallback={
          <LoadingScreen
            sx={{
              ...(!isDashboard && {
                top: 0,
                left: 0,
                width: 1,
                zIndex: 9999,
                position: 'fixed'
              })
            }}
          />
        }
      >
        <Component {...props} />
      </Suspense>
    );
  };

  return Render;
};

export default Loadable;
