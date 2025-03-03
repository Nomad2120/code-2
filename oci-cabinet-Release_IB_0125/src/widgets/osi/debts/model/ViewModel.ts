import { IOsiDebtsWidgetViewModel } from '@shared/types/mobx/widgets/OsiDebtsWidget';
import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { getOsiPastDebts } from '@shared/api/osi/pastDebts';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { OsiModule } from '@mobx/services/osiModule';
import logger from 'js-logger';
import { PastDebtsByOsiResponse } from '@shared/types/osi/debts';

@injectable()
export class OsiDebtsWidgetViewModel implements IOsiDebtsWidgetViewModel {
  isLoading = false;

  debts: any[] = [];

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);
    this.loadDebts();
  }

  private loadDebts = async () => {
    try {
      if (!this.osiModule.osiId) throw new Error('osi id is undefined');

      this.isLoading = true;
      this.debts = this.prepareDebts(await getOsiPastDebts(this.osiModule.osiId));
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  refreshDebts = this.loadDebts;

  private prepareDebts = (rawData: PastDebtsByOsiResponse[]) => {
    const ret = [];
    let id = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const abonent of rawData) {
      let totalAmount = 0;
      abonent.serviceGroups?.forEach((group) => {
        group.pastDebts?.forEach((debt) => {
          totalAmount += debt.amount;
        });
      });
      // eslint-disable-next-line no-plusplus
      Object.assign(abonent, { id: ++id, type: 'abonent', path: [id], totalAmount: totalAmount.toFixed(2) });
      ret.push(abonent);
      // eslint-disable-next-line no-restricted-syntax
      for (const serviceGroup of abonent.serviceGroups ?? []) {
        // @ts-expect-error abonent.id is exist
        // eslint-disable-next-line no-plusplus
        Object.assign(serviceGroup, { id: ++id, type: 'serviceGroup', path: [abonent.id, id] });
        ret.push(serviceGroup);
        // eslint-disable-next-line no-restricted-syntax
        for (const pastDebt of serviceGroup.pastDebts ?? []) {
          // @ts-expect-error abonent.id is exist
          // eslint-disable-next-line no-plusplus
          Object.assign(pastDebt, { id: ++id, type: 'pastDebt', path: [abonent.id, serviceGroup.id, id] });
          ret.push(pastDebt);
        }
      }
    }
    return ret;
  };
}
