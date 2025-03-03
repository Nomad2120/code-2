import { makeAutoObservable } from 'mobx';
import { ICreateDebtFeatureViewModel } from '@shared/types/mobx/features/OsiDebts';
import { injectable } from 'inversify';
import { getOsiAbonents } from '@shared/api/osi/abonents/get';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { OsiModule } from '@mobx/services/osiModule';
import { Abonent } from '@shared/types/osi/abonents';
import logger from 'js-logger';
import api from '@app/api';
import { ServiceGroupResponse } from '@shared/types/osi/services';
import { getPastDebts } from '@shared/api/pastDebts/get';
import { updatePastDebts } from '@shared/api/pastDebts/post';

const initialDebt: { saldo: number | null; list: any[] } = {
  saldo: null,
  list: []
};

@injectable()
export class CreateDebtFeatureViewModel implements ICreateDebtFeatureViewModel {
  isDialogOpen = false;

  isConfirmDialogOpen = false;

  isLoading = false;

  groups: ServiceGroupResponse[] = [];

  debt = initialDebt;

  confirmData: any = null;

  private _abonents: Abonent[] = [];

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);
    this.loadAbonents();
    this.loadGroups();
  }

  private _form: any = null;

  set form(form: any) {
    this._form = form;
  }

  private _refreshCb: any = null;

  set refreshCb(value: any) {
    this._refreshCb = value;
  }

  getAbonents = (serviceGroupId: number | null) => {
    if (!serviceGroupId) return [];
    if (serviceGroupId === 7) {
      return this._abonents.filter((abonent) => abonent.external);
    }
    return this._abonents.filter((abonent) => !abonent.external);
  };

  loadDebts = async (abonentId: number, serviceGroupId: number) => {
    try {
      const debts = await getPastDebts(abonentId, serviceGroupId);

      const { saldo, pastDebts } = debts;

      this.debt.saldo = saldo ?? null;
      this.debt.list =
        pastDebts
          ?.map((x, i) => ({ id: i, ...x }))
          .sort((a, b) => new Date(a.period).getDate() - new Date(b.period).getDate()) ?? [];
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  startCreatingDebt = () => {
    this.resetState();
    this.isDialogOpen = true;
  };

  cancelCreatingDebt = () => {
    this.isDialogOpen = false;
    this.resetState();
    this._refreshCb?.();
  };

  resetState = () => {
    this._form?.reset();
    this.debt = initialDebt;
    this.confirmData = null;
  };

  openConfirmDialog = () => {
    this.isConfirmDialogOpen = true;
  };

  onConfirm = async () => {
    try {
      const { period, amount } = this.confirmData;
      const abonentId = this._form?.getValues('abonent')?.id;
      const serviceGroupId = this._form?.getValues('serviceGroup')?.id;
      if (!abonentId || !serviceGroupId) throw new Error('abonentId or serviceGroupId is undefined');
      await updatePastDebts(abonentId, serviceGroupId, [{ period, amount }]);
    } catch (err) {
      notistackExternal.error(err?.toString());
    } finally {
      this.onCancel();
    }
  };

  onCancel = () => {
    this.isConfirmDialogOpen = false;
  };

  onCellEditCommit = async (params: any) => {
    const { id, value } = params;

    const row = params.row || this.debt.list[id];
    if (id === 0 && value !== this.debt.saldo) {
      this.confirmData = { ...row, amount: value };
      this.openConfirmDialog();
      return;
    }
    try {
      if (!row || !row.period) throw new Error('Сетевой сбой');
      const { period } = row;
      const abonentId = this._form?.getValues('abonent')?.id;
      const serviceGroupId = this._form?.getValues('serviceGroup')?.id;
      if (!abonentId || !serviceGroupId) throw new Error('abonentId or serviceGroupId is undefined');

      await updatePastDebts(abonentId, serviceGroupId, [{ period, amount: value }]);
    } catch (err) {
      notistackExternal.error(err?.toString());
    } finally {
      this.onCancel();
    }
  };

  private loadAbonents = async () => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');
      this.isLoading = true;
      this._abonents = await getOsiAbonents(this.osiModule.osiId);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  private loadGroups = async () => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');
      this.isLoading = true;
      this.groups = (await api.OsiServicesV2(this.osiModule.osiId)) as unknown as ServiceGroupResponse[];
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };
}
