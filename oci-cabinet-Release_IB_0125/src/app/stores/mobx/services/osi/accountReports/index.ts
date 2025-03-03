import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { OsiModule } from '@mobx/services/osiModule';
import {
  AccountListLastMonth,
  AccountReport,
  AccountReportCategory,
  AccountReportLastMonth
} from '@shared/types/osi/accountReports';
import { AccountReportsModel } from '@mobx/services/osi/accountReports/model';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { makePersistable } from 'mobx-persist-store';
import { appApi } from '@shared/api';

interface OsiInfo {
  name: string;
  idn: string;
  unionTypeId: number | null;
}

@injectable()
export class AccountReportsModule {
  allReports: AccountReport[] | null = null;

  lastMonthReport: AccountReportLastMonth | null = null;

  categories: AccountReportCategory[] | null = null;

  isLoading = false;

  constructor(private model: AccountReportsModel, private osiModule: OsiModule) {
    makeAutoObservable(this);
    makePersistable(this, { name: 'AccountReportsModule', properties: ['allReports', 'lastMonthReport'] });

    this.loadCategoriesCatalog();
  }

  get accounts(): AccountListLastMonth[] {
    return this.lastMonthReport?.lists ?? [];
  }

  get osiInfo(): OsiInfo {
    return {
      name: this.osiModule.osiInfo?.name || '',
      idn: this.osiModule.osiInfo?.idn || '',
      unionTypeId: this.osiModule.osiInfo?.unionTypeId || null
    };
  }

  loadCategoriesCatalog = async () => {
    try {
      this.isLoading = true;
      this.categories = await appApi.accountReports.getAccountReportsCategories();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  loadReports = async () => {
    await this.loadAllReports();

    await this.loadLastMonthReport();
  };

  loadAllReports = async () => {
    try {
      if (!this.osiModule.osiInfo?.id) return;

      this.isLoading = true;
      this.allReports = (await this.model.loadOsiAccountReports(
        this.osiModule.osiInfo.id
      )) as unknown as AccountReport[];
    } catch (e) {
      notistackExternal.error(e);
      logger.error(e);

      if (this.allReports?.length) {
        this.allReports = [];
      }
    } finally {
      this.isLoading = false;
    }
  };

  loadLastMonthReport = async () => {
    try {
      if (!this.osiModule.osiInfo?.id) return;
      this.isLoading = true;

      this.lastMonthReport = await this.model.loadLastMonthAccountReportsInfo(this.osiModule.osiInfo.id);
    } catch (e: any) {
      if (!e.includes('Отчет не найден')) {
        logger.error(e);
        notistackExternal.error();
      }
      this.lastMonthReport = null;
    } finally {
      this.isLoading = false;
    }
  };

  loadListById = async (listId: number) => {
    try {
      this.isLoading = true;
      return await this.model.loadListById(listId);
    } catch (e) {
      notistackExternal.error(e);
    } finally {
      this.isLoading = false;
    }
  };

  updateLastReportData = async () => {
    this.loadLastMonthReport();
  };
}
