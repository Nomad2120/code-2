import _ from 'lodash';
import { MessagesIntl } from './interfaces';

export const generateMessagesIntl = (structure: any): MessagesIntl =>
  _.reduce(
    structure,
    (parsed: any, translation: any, locale: any) => {
      parsed[locale] = parseTranslation(translation);
      return parsed;
    },
    {} as any
  );

const parseTranslation = (translation: any) =>
  _.reduce(
    translation,
    (result, value, key) => {
      flattening(result, value, key);
      return result;
    },
    {} as any
  );

const flattening = (result: any, value: any, key: any, pref = '') => {
  const prefix = [pref, key].filter((v) => v).join('_');

  if (typeof value === 'string') {
    return Object.assign(result, { [prefix]: value });
  }
  if (typeof value === 'object') {
    _.reduce(
      value,
      (res, val, key) => {
        flattening(res, val, key, prefix);
        return res;
      },
      result
    );
  }
  return null;
};

export const generateTokens = (structure: any) =>
  _.reduce(
    structure,
    (result, value, key) => {
      Object.assign(result, { [key]: parse(value, key) });
      return result;
    },
    {} as any
  );

const parse = (object: any, path: any) => {
  if (typeof object === 'string') {
    return path;
  }
  if (typeof object === 'object') {
    return _.reduce(
      object,
      (result, value, key) => {
        Object.assign(result, { [key]: parse(value, `${path}_${key}`) });
        return result;
      },
      {} as any
    );
  }
};
