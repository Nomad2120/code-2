import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { IOsiAccrualsByAbonentViewModel } from '@shared/types/mobx/widgets/OsiAccrualsByAbonentWidget';
import { Abonent } from '@shared/types/osi/abonents';
import { getOsiAbonents } from '@shared/api/osi/abonents/get';
import makeFlat from '@shared/utils/helpers/makeFlat';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';
import { OsiModule } from '@mobx/services/osiModule';
import api from '@app/api';
import moment from 'moment';
import { sumBy } from 'lodash';

function getUniqName(name: any) {
  if (!name) {
    return `${name}#`;
  }
  return name;
}

function getRows(abonents: any) {
  return abonents.reduce(
    (acc: any, item: any) => [
      ...acc,
      {
        id: item.groupName,
        level: 0,
        groupName: [item.groupName],
        totalAccrual: sumBy(item.services, 'accural'),
        totalFix: sumBy(item.services, 'fix'),
        totalTotal: sumBy(item.services, 'total')
      },
      ...item.services.map((e: any) => ({
        id: `${item.groupName + getUniqName(e.serviceName)}`,
        level: 1,
        groupName: [item.groupName, e.serviceName],
        totalAccrual: e.accural,
        totalFix: e.fix,
        totalTotal: e.total
      }))
    ],
    []
  );
}

@injectable()
export class OsiAccrualsByAbonentViewModel implements IOsiAccrualsByAbonentViewModel {
  abonents: Abonent[] = [];

  dateValue: any = moment().add(-1, 'month');

  endDate: any = moment(this.dateValue).endOf('month').toDate();

  isLoading = false;

  rows: any[] = [];

  selectedAbonent: Abonent | null = null;

  startDate: any = moment(this.dateValue).startOf('month').toDate();

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);
  }

  loadAbonents = async (): Promise<void> => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');

      this.isLoading = true;
      const data = await getOsiAbonents(this.osiModule.osiId);

      const allAbonents = data.map((abonent) => {
        if (abonent.external) {
          return { ...abonent, flat: `Аренда(${abonent.name})` };
        }
        return abonent;
      });

      this.abonents = allAbonents.map((e) => ({ ...e, flat: makeFlat(e) }));
      this.selectedAbonent = data?.length ? data[0] : null;
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  loadAccruals = async (): Promise<void> => {
    try {
      if (!this.osiModule.osiId || !this.selectedAbonent?.id) throw new Error('osiId or abonentId is undefined');

      this.isLoading = true;

      const data = await api.getAccrualsByAbonent(
        this.selectedAbonent.id,
        moment.utc(this.startDate).local().format('YYYY-MM-DD'),
        moment.utc(this.endDate).local().format('YYYY-MM-DD')
      );

      this.rows = getRows(data);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };
}
