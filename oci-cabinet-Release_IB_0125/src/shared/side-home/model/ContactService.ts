import { makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { callMeBack } from '@shared/api/telegramBot/send';
import logger from 'js-logger';
import { CallMeBackNotificationRequest } from '@shared/types/telegramBot';
import { makePersistable } from 'mobx-persist-store';
import notistackExternal from '@shared/utils/helpers/notistackExternal';

@injectable()
export class ContactService {
  isNotifyOpen = false;

  isError = false;

  errType = '';

  tempData: CallMeBackNotificationRequest | null = null;

  timeouts: { animation: any; closing: any } = {
    animation: null,
    closing: null
  };

  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, { name: 'ContactService', properties: ['_abonentType'] });
  }

  /** При первом выборе - остается пустым, далее подтягивается из persist */
  _abonentType = '';

  get abonentType() {
    return this._abonentType;
  }

  set abonentType(value) {
    this._abonentType = value;
  }

  _isShowAbonentTypeModal = false;

  get isShowAbonentTypeModal() {
    return this._isShowAbonentTypeModal;
  }

  openSelectAbonentTypeModal = () => {
    this._isShowAbonentTypeModal = true;
  };

  closeSelectAbonentTypeModal = () => {
    this._isShowAbonentTypeModal = false;
  };

  approveAbonentType = async () => {
    if (!this.tempData) return;
    if (this._abonentType === 'abonent') {
      this.disallowAbonentSending();
      return;
    }

    try {
      this.isLoading = true;
      await callMeBack(this.tempData);
      this.openNotify();
      this.closeSelectAbonentTypeModal();
    } catch (e: any) {
      if (e instanceof Error) {
        logger.error(e);
        notistackExternal.error();
      } else {
        notistackExternal.error();
      }
    } finally {
      this.isLoading = false;
    }
  };

  disallowAbonentSending = () => {
    this.isError = true;
    this.errType = 'wrongAbonentType';
    this.openNotify();
    this.closeSelectAbonentTypeModal();
  };

  sendCallBackData = async (data: CallMeBackNotificationRequest) => {
    try {
      this.isError = false;
      if (this._abonentType === '') {
        this.openSelectAbonentTypeModal();
        this.tempData = data;
        return;
      }

      if (this._abonentType === 'abonent') {
        this.disallowAbonentSending();
        return;
      }

      await callMeBack(data);
      this.openNotify();
      this.closeSelectAbonentTypeModal();
    } catch (e) {
      this.isError = true;
      logger.error(e);
      this.openNotify();
    }
  };

  openNotify = () => {
    this.isNotifyOpen = true;

    if (this.timeouts.closing) {
      clearTimeout(this.timeouts.closing);
    }

    this.timeouts.closing = setTimeout(() => {
      this.closeNotify();
      this.timeouts.closing = null;
    }, 10 * 1000);
  };

  closeNotify = () => {
    this.isNotifyOpen = false;
    const animationDuration = 0.15 * 1000;
    if (this.timeouts.animation) {
      clearTimeout(this.timeouts.animation);
    }

    this.timeouts.animation = setTimeout(() => {
      this.isError = false;
      this.errType = '';
      this.timeouts.animation = null;
    }, animationDuration);
  };
}
