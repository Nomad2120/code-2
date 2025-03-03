import { makeAutoObservable } from 'mobx';
import { IOsiAccrualsWidgetViewModel } from '@shared/types/mobx/widgets/OsiAccrualsWidget';
import { injectable } from 'inversify';
import api from '@app/api';
import { OsiModule } from '@mobx/services/osiModule';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { ServiceGroupResponse } from '@shared/types/osi/services';

@injectable()
export class OsiAccrualsWidgetViewModel implements IOsiAccrualsWidgetViewModel {
  isLoading = false;

  serviceGroups: ServiceGroupResponse[] = [];

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);
    this.loadServiceGroups();
  }

  get isCanRemakeAccruals() {
    return this.osiModule.osiInfo?.canRemakeAccurals ?? false;
  }

  loadServiceGroups = async () => {
    try {
      if (!this.osiModule.osiInfo) return;

      this.isLoading = true;

      this.serviceGroups = (await api.OsiServicesV2(this.osiModule.osiId)) as unknown as ServiceGroupResponse[];
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  reloadServiceGroups = async () => {
    await this.loadServiceGroups();
  };
}
