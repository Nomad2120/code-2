export const LOCALES = {
  RU: 'ru-RU' as LOCALE,
  KZ: 'kz-KZ' as LOCALE
};

export const PREFIXES = {
  [LOCALES.RU]: ['RU', '_ru', 'Ru'],
  [LOCALES.KZ]: ['KZ', '_kz', 'Kz']
};

export type LOCALE = 'ru-RU' | 'kz-KZ';
