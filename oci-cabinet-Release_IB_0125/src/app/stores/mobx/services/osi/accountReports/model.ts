import { makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import api from '@app/api';
import { AccountReport, AccountReportLastMonth, AccountReportList } from '@shared/types/osi/accountReports';

@injectable()
export class AccountReportsModel {
  constructor() {
    makeAutoObservable(this);
  }

  loadOsiAccountReports = async (osiId: number): Promise<AccountReport[]> =>
    (await api.GetOsiAccountsByOsiId(osiId)) as unknown as AccountReport[];

  loadLastMonthAccountReportsInfo = async (osiId: number): Promise<AccountReportLastMonth> =>
    (await api.GetAccountReportPrevMonthStatusByOsiId(osiId)) as unknown as AccountReportLastMonth;

  loadListById = async (listId: number): Promise<AccountReportList> =>
    (await api.GetAccountReportListByListId(listId)) as unknown as AccountReportList;
}
