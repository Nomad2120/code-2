import { makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { IAddServiceButtonFeatureViewModel } from '@shared/types/mobx/features/osiAccruals';
import { OsiModule } from '@mobx/services/osiModule';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { OsiServiceRequest, OsiServiceResponse } from '@shared/types/osi/services';
import { createOsiService } from '@shared/api/osiServices/create';
import { MutableRefObject } from 'react';
import { RefHandle } from '@features/osi/accruals/abonents/ui/OsiServiceAbonentsButton';

@injectable()
export class AddServiceButtonFeatureViewModel implements IAddServiceButtonFeatureViewModel {
  isDialogOpen = false;

  hookForm: any = null;

  isLoading = false;

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);
  }

  _service: OsiServiceResponse | null = null;

  get service(): OsiServiceResponse | null {
    return this._service;
  }

  set service(service: OsiServiceResponse) {
    this._service = service;
  }

  _abonentsTableRef: MutableRefObject<RefHandle | null> | null = null;

  set abonentsTableRef(ref: any) {
    this._abonentsTableRef = ref;
  }

  reloadCb: any = () => {};

  closeDialog = () => {
    this.isDialogOpen = false;
  };

  openDialog = () => {
    this.isDialogOpen = true;
    this.hookForm?.reset();
    this.hookForm?.trigger();
  };

  setReloadCb = (cb: any) => {
    this.reloadCb = cb;
  };

  createService = async (values: any) => {
    try {
      if (!this.osiModule.osiId && this.osiModule.osiId !== 0) return;
      this.isLoading = true;
      const payload: OsiServiceRequest = {
        osiId: this.osiModule.osiId,
        nameRu: values.service.nameRu,
        nameKz: values.service.nameKz,
        serviceGroupId: values.serviceGroupId,
        accuralMethodId: values.accrualMethodId,
        amount: values.amount
      };
      this.service = await createOsiService(payload);
      // this.reloadCb?.();
      await this.openAbonentsTable();
      this.closeDialog();
    } catch (e) {
      logger.error(e);
      if (e instanceof Error) {
        notistackExternal.error();
        return;
      }
      notistackExternal.error(e);
    } finally {
      this.isLoading = false;
    }
  };

  openAbonentsTable = async () => {
    if (!this.service) {
      this.reloadCb?.();
      return;
    }

    await this._abonentsTableRef?.current?.openTableManual(this.service);
  };

  setHookForm = (hookForm: any) => {
    this.hookForm = hookForm;
  };
}
