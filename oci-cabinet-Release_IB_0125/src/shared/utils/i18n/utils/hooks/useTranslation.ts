import { useIntl } from 'react-intl';
import { ruRU } from '@mui/x-data-grid-pro';
// eslint-disable-next-line import/no-duplicates
import kk from 'date-fns/locale/kk';
// eslint-disable-next-line import/no-duplicates
import ru from 'date-fns/locale/ru';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import moment from 'moment/min/moment-with-locales';
import { useTranslation as useTranslationNext } from 'react-i18next';
import { messages } from '../../messages';
import { LOCALES, PREFIXES } from '../../locales';
import { kzKZ } from '../../dataGrid/kzKZ';

export const useTranslation = () => {
  const intl = useIntl();
  const { t } = useTranslationNext();

  const translateToken = (id: string, fallbackMessage: string | null = null) => {
    if (!id) {
      return fallbackMessage || '';
    }
    const defaultMessage = fallbackMessage || messages[intl.defaultLocale][id];
    return intl.formatMessage({ id, defaultMessage });
  };

  const fieldWithPrefix = (value: Record<string, any>, fieldWithoutPrefix: string) => {
    const options = PREFIXES[intl.locale]
      .map((prefix) => value[`${fieldWithoutPrefix}${prefix}`])
      .filter((option) => option !== undefined);

    if (options.length > 0) {
      return options[0];
    }

    return value[`${fieldWithoutPrefix}${PREFIXES[LOCALES.RU][2]}`];
  };

  const addPrefix = (value: string) => `${value}${PREFIXES[intl.locale][2]}`;

  const getGridLocale = () => {
    if (intl.locale === LOCALES.KZ) return kzKZ;

    return ruRU.components.MuiDataGrid.defaultProps.localeText;
  };

  const getDateLocale = () => {
    if (intl.locale === LOCALES.KZ) return kk;

    return ru;
  };

  const getGridPaginationLocaleProps = () => {
    const props = {
      pagination: {
        labelRowsPerPage: t('common:dataGrid.rowsPerPage'),
        labelDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) =>
          `${from}–${to} ${t('common:dataGrid.of')} ${count}`
      }
    };

    return props;
  };

  const getLocale = () => {
    if (intl.locale === LOCALES.KZ) return 'kz';

    return 'ru';
  };

  const getMoment = () => {
    const localMoment = moment();
    if (intl.locale === LOCALES.KZ) return localMoment.locale('kk');
    return localMoment.locale('ru');
  };

  return {
    translateToken,
    fieldWithPrefix,
    getGridLocale,
    getGridPaginationLocaleProps,
    addPrefix,
    getDateLocale,
    getLocale,
    getMoment,
    t,
    intl
  };
};
