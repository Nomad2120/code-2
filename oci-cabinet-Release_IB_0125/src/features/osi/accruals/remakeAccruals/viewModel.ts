import { makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';
import { remakeLastAccruals } from '@shared/api/osi';
import { OsiModule } from '@mobx/services/osiModule';

@injectable()
export class ViewModel {
  isOpenModal = false;

  isLoading = false;

  constructor(private _osiModule: OsiModule) {
    makeAutoObservable(this);
  }

  remakeAccruals = async () => {
    try {
      if (!this._osiModule.osiId) throw new Error('Не найден osiId');
      this.isLoading = true;
      await remakeLastAccruals(this._osiModule.osiId);
      this.closeModal();
    } catch (e) {
      logger.error(e);
      notistackExternal.error('Ошибка');
    } finally {
      this.isLoading = false;
    }
  };

  openModal = () => {
    this.isOpenModal = true;
  };

  closeModal = () => {
    this.isOpenModal = false;
  };
}
