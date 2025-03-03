import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import api from '@app/api';
import { AccountReport } from '@shared/types/osi/accountReports';
import { PATH_APPARTMENT, PATH_CABINET } from '@app/routes/paths';
import logger from 'js-logger';
import { makePersistable } from 'mobx-persist-store';
import { HistoryModule } from '@mobx/services/history';
import notistackExternal from '@/shared/utils/helpers/notistackExternal';

@injectable()
export class AppartmentsModule {
  abonentId: number | null = null;

  osi: any = null;

  accounts: any = null;

  serviceCompanies: any = null;

  docs: any = null;

  accountReports: AccountReport[] = [];

  constructor(private history: HistoryModule) {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'AppartmentsModule',
      properties: ['abonentId', 'osi', 'accounts', 'serviceCompanies', 'docs', 'accountReports']
    });
  }

  selectAppartment = async (id: number) => {
    try {
      this.osi = (await api.AbonentGetOsi(id)) as any;

      const reports = (await api.GetOsiAccountsByOsiId(this.osi?.id)) as unknown as any[];

      const publishedAccountReports = reports?.length ? reports?.filter((report) => report.state === 'PUBLISHED') : [];

      this.accountReports = publishedAccountReports;
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }

    try {
      const osi = (await api.AbonentGetOsi(id)) as any;

      const results = (await Promise.all([
        api.OsiAccounts(osi.id),
        api.OsiServiceCompanies(osi.id),
        api.OsiDocs(osi.id)
      ])) as unknown as [any, any, any, AccountReport[]];

      this.abonentId = id;
      this.osi = osi;
      // eslint-disable-next-line prefer-destructuring
      this.accounts = results[0];
      // eslint-disable-next-line prefer-destructuring
      this.serviceCompanies = results[1];
      // eslint-disable-next-line prefer-destructuring
      this.docs = results[2];
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.history.navigateTo(PATH_APPARTMENT.root);
    }
  };

  exit = async () => {
    this.history.navigateTo(PATH_CABINET.root);
  };
}
