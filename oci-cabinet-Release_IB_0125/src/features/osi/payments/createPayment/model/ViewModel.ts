import { makeAutoObservable } from 'mobx';
import { IOsiCreatePaymentFeatureViewModel } from '@shared/types/mobx/features/osiPayments';
import { injectable } from 'inversify';
import { Abonent } from '@shared/types/osi/abonents';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import api from '@app/api';
import { OsiModule } from '@mobx/services/osiModule';
import { getOsiAbonents } from '@shared/api/osi/abonents/get';
import { ProfileModule } from '@mobx/services/profile';
import moment from 'moment';

@injectable()
export class OsiCreatePaymentFeatureViewModel implements IOsiCreatePaymentFeatureViewModel {
  abonents: Abonent[] = [];

  groups: any[] = [];

  isDialogOpen = false;

  user: any;

  isLoading = false;

  constructor(private osiModule: OsiModule, private profileModule: ProfileModule) {
    makeAutoObservable(this);
    this.loadAbonents();
    this.loadGroups();
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

  createPayment = async (values: any): Promise<void> => {
    try {
      this.isLoading = true;

      const service = {
        serviceGroupId: values.group.group_id,
        sum: parseFloat(values.amount)
      };

      const date = moment(values.date).local().format('YYYY-MM-DD[T]HH:mm:ss[Z]');

      const payment = {
        abonentNum: values.abonent.id,
        date,
        services: [service]
      };

      const payload = { userId: this.profileModule.userData.id, payment };

      await api.PaymentCreate(payload.userId, payload.payment);

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

  loadGroups = async () => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');
      this.isLoading = true;
      this.groups = (await api.GetGroupsAndServicesForFixes(this.osiModule.osiId)) as unknown as any;
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
