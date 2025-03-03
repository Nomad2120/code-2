import { makeAutoObservable } from 'mobx';
import { IOsiServiceSaldoWidgetViewModel } from '@shared/types/mobx/widgets/OsiServiceSaldo';
import { getOsiSaldoByGroupsByOsiId } from '@shared/api/osi/saldoByGroups';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';
import { injectable } from 'inversify';
import { OsiModule } from '@mobx/services/osiModule';
import { ServiceGroupSaldoResponse } from '@shared/types/osi/saldoByGroups';

@injectable()
export class OsiServiceSaldoWidgetViewModel implements IOsiServiceSaldoWidgetViewModel {
  saldoByGroup: ServiceGroupSaldoResponse[] = [];

  isLoading = false;

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);

    this.loadSaldoByGroup();
  }

  private async loadSaldoByGroup() {
    try {
      if (!this.osiModule.osiId) {
        throw new Error('OsiId is undefined');
      }
      this.isLoading = true;
      this.saldoByGroup = await getOsiSaldoByGroupsByOsiId(this.osiModule.osiId);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  }
}
