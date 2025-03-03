import { LOCALES } from './locales';
import { translationRu } from './lang/ru';
import { translationKz } from './lang/kz';
import { generateMessagesIntl, generateTokens } from './utils/functions';
import { Structure } from './utils/interfaces';

const structure: Structure = {
  [LOCALES.RU]: translationRu,
  [LOCALES.KZ]: translationKz
};

export const messages = generateMessagesIntl(structure);

export const tokens = generateTokens(translationRu);
