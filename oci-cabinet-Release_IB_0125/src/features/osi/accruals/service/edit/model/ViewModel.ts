import { IEditServiceButtonFeatureViewModel } from '@shared/types/mobx/features/osiAccruals';
import { makeAutoObservable } from 'mobx';
import { editOsiService } from '@shared/api/osiServices/edit';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';
import { injectable } from 'inversify';
import { EditServiceFormValues, OsiServiceRequest, OsiServiceResponse } from '@shared/types/osi/services';
import { OsiModule } from '@mobx/services/osiModule';

@injectable()
export class EditButtonFeatureViewModel implements IEditServiceButtonFeatureViewModel {
  isDialogOpen = false;

  hookForm: any = null;

  isLoading = false;

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);
  }

  closeDialog = (): void => {
    this.isDialogOpen = false;
    this.hookForm?.reset();
  };

  editService = async (values: EditServiceFormValues & { serviceId: number }): Promise<void> => {
    try {
      if (!this.osiModule.osiId && this.osiModule.osiId !== 0) return;

      this.isLoading = true;

      const payload: OsiServiceRequest = {
        accuralMethodId: values.accrualMethodId,
        amount: values.amount,
        nameKz: values.service.nameKz,
        nameRu: values.service.nameRu,
        osiId: this.osiModule.osiId,
        serviceGroupId: values.serviceGroupId
      };
      await editOsiService(values.serviceId, payload);
      this._reloadCb?.();
      this.closeDialog();
    } catch (e) {
      if (e instanceof Error) {
        notistackExternal.error();
        return;
      }
      notistackExternal.error(e);
    } finally {
      this.isLoading = false;
    }
  };

  openDialog = (): void => {
    this.isDialogOpen = true;
  };

  onEditServiceClick = (service: OsiServiceResponse, isCustom: boolean): void => {
    const values = {
      service: {
        code: isCustom ? 'custom' : 'default',
        nameRu: service.nameRu ?? '',
        nameKz: service.nameKz ?? ''
      },
      serviceGroupId: service.serviceGroupId,
      accrualMethodId: service.accuralMethodId,
      amount: service.amount,
      serviceId: service.id
    };

    this.hookForm?.reset(values);
    this.hookForm?.trigger();

    this.openDialog();
  };

  setHookForm = (hookForm: any): void => {
    this.hookForm = hookForm;
  };

  setReloadCb = (cb: any): void => {
    this._reloadCb = cb;
  };

  private _reloadCb: any = () => {};
}
