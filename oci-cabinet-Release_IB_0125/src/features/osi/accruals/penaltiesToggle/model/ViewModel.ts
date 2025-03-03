import { makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { IPenaltiesToggleViewModel } from '@shared/types/mobx/features/osiAccruals';
import { OsiModule } from '@mobx/services/osiModule';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';
import api from '@app/api';

@injectable()
export class PenaltiesToggleViewModel implements IPenaltiesToggleViewModel {
  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);
  }

  get isFinesEnabled(): boolean {
    return this.osiModule.osiInfo?.createFine ?? false;
  }

  toggleFines = async () => {
    try {
      if (!this.osiModule.osiInfo) return;

      const payload = this.osiModule.osiInfo;

      payload.createFine = !payload.createFine;

      await api.OsiUpdate(payload?.id, payload);
      await this.osiModule.refreshOsi();

      notistackExternal.success();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };
}
