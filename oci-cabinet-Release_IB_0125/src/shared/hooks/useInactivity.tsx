import { useEffect, useRef } from 'react';

interface Props {
  onIdle: () => void;
  duration: number;
}

export const useInactivity = ({ onIdle, duration }: Props) => {
  const timer = useRef<any>(null);

  useEffect(() => {
    const startTimer = () => {
      timer.current = setTimeout(() => {
        onIdle();
      }, duration);
    };

    const resetTimer = () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }

      startTimer();
    };

    ['click', 'touchstart', 'mousemove', 'wheel', 'keydown'].forEach((evt) =>
      document.addEventListener(evt, resetTimer, false)
    );

    return () => {
      ['click', 'touchstart', 'mousemove', 'wheel', 'keydown'].forEach((evt) =>
        document.removeEventListener(evt, resetTimer, false)
      );
    };
  }, [duration, onIdle]);
};
