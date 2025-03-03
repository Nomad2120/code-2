import { translationRu } from '../lang/ru';

type Subset<K> = {
  [attr in keyof K]?: K[attr] extends Record<string, unknown> ? Subset<K[attr]> : K[attr];
};

export type translation = Subset<typeof translationRu>;

export type Structure = Record<string, translation>;

export type Tokens = translation;

export type MessagesIntl = Record<string, Record<string, string>>;
