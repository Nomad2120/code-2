import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';
import React from 'react';
import { useTranslation } from '@/shared/utils/i18n';

interface Props {
  children: React.ReactNode;
}

export const DateTimeLocalizationProvider: React.FC<Props> = ({ children }) => {
  const { getDateLocale } = useTranslation();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={getDateLocale()}>
      {children}
    </LocalizationProvider>
  );
};
