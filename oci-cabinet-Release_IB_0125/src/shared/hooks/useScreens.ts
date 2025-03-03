import { useMediaQuery } from 'react-responsive';

const screens = {
  isMobile: 'isMobile'
} as const;
export const useScreens = (): Record<keyof typeof screens, boolean> => {
  const isMobile = useMediaQuery({ maxWidth: 621 });

  return {
    isMobile
  };
};
