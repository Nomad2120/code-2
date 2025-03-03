import { makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { IEditAdditionalServiceFeatureViewModel } from '@shared/types/mobx/features/osiAccruals';
import { OsiServiceRequest, OsiServiceResponse } from '@shared/types/osi/services';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { getOsiAbonents } from '@shared/api/osi/abonents/get';
import { OsiModule } from '@mobx/services/osiModule';
import logger from 'js-logger';
import { getOsiServiceAbonents } from '@shared/api/osiServices/abonents/get';
import { editOsiService } from '@shared/api/osiServices/edit';

@injectable()
export class EditAdditionalServiceFeatureViewModel implements IEditAdditionalServiceFeatureViewModel {
  isDialogOpen = false;

  isLoading = false;

  hookForm: any = null;

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);
  }

  get osiId() {
    return this.osiModule.osiId ?? 0;
  }

  closeDialog = (): void => {
    this.isDialogOpen = false;
    this.hookForm?.reset();
  };

  onEditServiceClick = async (service: OsiServiceResponse, isCustomName: boolean): Promise<void> => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');
      if (!service.id) throw new Error('serviceId is undefined');
      const arendator = (await getOsiServiceAbonents(service.id)).find((abonent) => abonent.checked);

      if (!arendator) throw new Error('arendator is undefined');

      const values = {
        service: {
          code: isCustomName ? 'custom' : 'default',
          nameRu: service.nameRu ?? '',
          nameKz: service.nameKz ?? ''
        },
        serviceGroupId: service.serviceGroupId,
        accrualMethodId: service.accuralMethodId,
        amount: service.amount,
        serviceId: service.id,
        arendator: { value: arendator, inputValue: arendator.name }
      };

      this.hookForm?.reset(values);
      this.hookForm?.trigger();

      this.openDialog();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  onSubmitEditServiceClick = async (values: any): Promise<void> => {
    try {
      const payload: OsiServiceRequest = {
        osiId: this.osiModule.osiId ?? 0,
        serviceGroupId: values.serviceGroupId,
        accuralMethodId: values.accrualMethodId,
        nameRu: values.service.nameRu,
        nameKz: values.service.nameKz,
        amount: values.amount
      };
      await editOsiService(values.serviceId, payload);
      notistackExternal.success();
      this._reloadCb?.();
      this.closeDialog();
    } catch (e) {
      logger.error(e);
      if (e instanceof Error) {
        notistackExternal.error();
        return;
      }
      notistackExternal.error(e);
    }
  };

  openDialog = (): void => {
    this.isDialogOpen = true;
  };

  setHookForm = (hookForm: any): void => {
    this.hookForm = hookForm;
  };

  setReloadCb = (cb: any): void => {
    this._reloadCb = cb;
  };

  private _reloadCb: any = () => {};
}
