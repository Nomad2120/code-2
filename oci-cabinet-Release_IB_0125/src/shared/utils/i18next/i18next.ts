import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

const initOptions = {
  debug: true,
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false
  },
  ns: [
    'common',
    'accountReports',
    'accruals',
    'systemReports',
    'osv',
    'registration',
    'demo',
    'auth',
    'home',
    'invoices',
    'accountApplications',
    'abonents',
    'acts',
    'debts',
    'payments'
  ]
};

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(async (language, namespace, callback) => {
      try {
        const translations = await Promise.all([import(`./translations/${namespace}/${language}.json`)]);

        callback(null, translations[0]);
      } catch (e) {
        if (e instanceof Error) {
          callback(e, null);
        }
      }
    })
  )
  .init(initOptions);
