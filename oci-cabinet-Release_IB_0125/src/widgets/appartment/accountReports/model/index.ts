import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { AppartmentsModule } from '@mobx/services/appartments';
import logger from 'js-logger';
import api from '@app/api';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { AccountReport, AccountReportCategory, AccountReportList } from '@shared/types/osi/accountReports';
import _ from 'lodash';
import moment from 'moment/moment';
import { appApi } from '@shared/api';
import { openPdfDoc } from '@shared/utils/helpers/docs';

interface ViewerParams {
  isOpen: boolean;
  selectedAccount: any;
  selectedReport: AccountReport | null;
  isLoading: boolean;
}

const initialViewerParams = {
  isOpen: false,
  selectedAccount: null,
  selectedReport: null,
  isLoading: false
};

@injectable()
export class AppartmentReportsViewModel {
  viewer: ViewerParams = initialViewerParams;

  categories: AccountReportCategory[] | null = null;

  constructor(private appartmentsModule: AppartmentsModule) {
    makeAutoObservable(this);

    this.loadCategoriesCatalog();
  }

  get reports() {
    const { accountReports } = this.appartmentsModule;
    return _.sortBy(accountReports, (report) => report.period).reverse();
  }

  get period() {
    return `${moment(this.viewer.selectedReport?.period).startOf('month').format('DD.MM.YYYY')} - ${moment(
      this.viewer.selectedReport?.period
    )
      .endOf('month')
      .format('DD.MM.YYYY')}`;
  }

  get filledItemsIds() {
    const accountItems = this.viewer.selectedAccount?.items;

    if (!accountItems || !accountItems?.length) return [];

    const filledItemsIds = accountItems
      .filter((item: { details: string | any[] }) => item?.details?.length)
      .map((item: { id: any }) => item?.id);

    return filledItemsIds;
  }

  isReportHasDocs = (reportId: number) => {
    const report = this.reports.find((report) => report.id === reportId);

    if (!report || !report.docs?.[0]) return false;

    return true;
  };

  getCategoryById = (categoryId: number | null) => {
    const category = this.categories?.find((category) => category.id === categoryId);
    if (!category) return '';

    return category.nameRu;
  };

  loadCategoriesCatalog = async () => {
    try {
      this.categories = await appApi.accountReports.getAccountReportsCategories();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  reset = async () => {
    this.viewer = initialViewerParams;
  };

  showListDetails = async (list: AccountReportList) => {
    try {
      this.viewer.isLoading = true;
      this.openViewer();
      const fullInfo = await api.GetAccountReportListByListId(list?.id);
      this.viewer.selectedAccount = fullInfo;
      const allReports = (await api.GetOsiAccountsByOsiId(this.appartmentsModule.osi.id)) as unknown as AccountReport[];

      const report = _.find(allReports, (report) => _.find(report.lists, (reportList) => reportList.id === list.id));

      if (report) {
        this.viewer.selectedReport = <AccountReport>report;
      }
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.viewer.isLoading = false;
    }
  };

  openViewer = () => {
    this.viewer.isOpen = true;
  };

  closeViewer = () => {
    this.viewer = initialViewerParams;
  };

  showReportListByReportId = async (reportId: number) => {
    const report = this.reports.find((report) => report.id === reportId);

    if (!report?.docs?.[0]?.scan?.id) return;

    const scanId = report.docs[0].scan.id;
    const base64doc = (await api.getScanDoc(scanId)) as unknown as string;
    openPdfDoc(base64doc);
  };
}
