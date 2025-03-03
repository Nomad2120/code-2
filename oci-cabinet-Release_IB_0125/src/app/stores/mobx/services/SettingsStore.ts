import { autorun, makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { LOCALE, LOCALES } from '@shared/utils/i18n/locales';
import { createIntl, IntlShape } from 'react-intl';
import { messages } from '@shared/utils/i18n';
import i18next from 'i18next';
import { makePersistable } from 'mobx-persist-store';
import moment from 'moment';

import 'moment/dist/locale/kk';
import 'moment/dist/locale/ru';

@injectable()
export class SettingsStore {
  locale: LOCALE = LOCALES.RU;

  intl: IntlShape;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, { name: 'settingsStore', properties: ['locale'] });
    this.intl = createIntl({
      locale: this.locale,
      messages: messages[this.locale]
    });

    autorun(() => {
      this.intl = createIntl({
        locale: this.locale,
        messages: messages[this.locale]
      });
    });

    autorun(() => {
      if (this.locale?.slice(0, 2) === 'kz') {
        i18next.changeLanguage('kk');
        moment().locale('kk');
        return;
      }
      i18next.changeLanguage('ru');
      moment().locale('ru');
    });
  }

  get moment() {
    if (i18next.language === 'kk') {
      moment.locale('kk');
    } else {
      moment.locale('ru');
    }
    return moment;
  }

  changeLanguage = (language: LOCALE) => {
    this.locale = language;
    if (language.slice(0, 2) === 'kz') {
      i18next.changeLanguage('kk');
      moment().locale('kk');
      return;
    }
    i18next.changeLanguage('ru');
    moment().locale('ru');
  };
}
