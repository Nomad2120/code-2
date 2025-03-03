import { IOsiCreateCorrectionFeatureViewModel } from '@shared/types/mobx/features/OsiCorrection';
import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { Abonent } from '@shared/types/osi/abonents';
import { ServiceGroupResponse } from '@shared/types/osi/services';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import api from '@app/api';
import { OsiModule } from '@mobx/services/osiModule';
import { getOsiAbonents } from '@shared/api/osi/abonents/get';
import { ProfileModule } from '@mobx/services/profile';

@injectable()
export class OsiCreateCorrectionFeatureViewModel implements IOsiCreateCorrectionFeatureViewModel {
  abonents: Abonent[] = [];

  groups: ServiceGroupResponse[] = [];

  isDialogOpen = false;

  user: any;

  isLoading = false;

  constructor(private osiModule: OsiModule, private profileModule: ProfileModule) {
    makeAutoObservable(this);

    this.loadGroups();
    this.loadAbonents();
  }

  private _onSuccessCb = () => {};

  set onSuccessCb(value: () => Promise<void>) {
    this._onSuccessCb = value;
  }

  closeDialog = async (event?: any, reason?: string): Promise<void> => {
    if (reason === 'backdropClick') return;
    this.isDialogOpen = false;
  };

  openDialog = async (): Promise<void> => {
    this.isDialogOpen = true;
  };

  createCorrection = async (values: any): Promise<void> => {
    try {
      this.isLoading = true;

      const userId = this.profileModule.userData.id;

      const service = {
        serviceId: values.service?.service_id,
        sum: parseFloat(values.amount)
      };

      const payload = {
        abonentNum: values.abonent.id,
        reason: values.reason,
        services: [service]
      };

      await api.PaymentCorrectionCreate(userId, payload);

      await this.closeDialog();
      await this._onSuccessCb?.();

      notistackExternal.success();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  loadGroups = async (): Promise<void> => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');
      this.isLoading = true;

      // @ts-expect-error api not typed
      this.groups = await api.GetGroupsAndServicesForFixes(this.osiModule.osiId);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  private loadAbonents = async () => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');
      this.isLoading = true;
      this.abonents = await getOsiAbonents(this.osiModule.osiId);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };
}
