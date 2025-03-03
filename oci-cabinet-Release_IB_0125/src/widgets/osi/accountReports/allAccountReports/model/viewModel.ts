import { injectable } from 'inversify';
import { autorun, makeAutoObservable } from 'mobx';
import { AccountReportsModule } from '@mobx/services/osi/accountReports';
import logger from 'js-logger';
import _ from 'lodash';
import {
  AccountReport,
  AccountReportList,
  AccountReportListItem,
  OperationTypes
} from '@shared/types/osi/accountReports';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import api from '@app/api';
import { ReportDialog, ViewMode } from '@widgets/osi/accountReports/ReportDialog/model/type';
import moment from 'moment/moment';
import { AccountType } from '@widgets/osi/accountReports/model/viewModel';
import { openPdfDoc } from '@shared/utils/helpers/docs';
import { OsiModule } from '@mobx/services/osiModule';

interface DialogState {
  accept: {
    reportForPublish: AccountReport | null;
    isOpen: boolean;
  };
  editor: {
    listForEdition: AccountReportList | null;
    isOpen: boolean;
    viewMode: boolean;
    isError: boolean;
    isLoading: boolean;
  };
  viewer: {
    selectedReport: AccountReport | null;
    selectedList: AccountReportList | null;
    isOpen: boolean;
  };
  freeMode: {
    isOpen: boolean;
  };
}

const initialReportDialogState: ReportDialog = {
  isOpen: false,
  viewMode: ViewMode.Select_account,
  selectedReport: null,
  selectedAccount: null,
  editorFilters: {
    checked: false,
    filterModel: { items: [] }
  },
  hookForm: null,
  isReadonly: false
};

@injectable()
export class AllAccountReportsViewModel {
  hookForm: any = null;

  reportDialog = initialReportDialogState;

  reportForPublish: any = null;

  dialog: DialogState = {
    accept: {
      reportForPublish: null,
      isOpen: false
    },
    editor: {
      listForEdition: null,
      isOpen: false,
      viewMode: false,
      isError: false,
      isLoading: false
    },
    viewer: {
      selectedReport: null,
      selectedList: null,
      isOpen: false
    },
    freeMode: {
      isOpen: false
    }
  };

  constructor(private accountReportsModule: AccountReportsModule, private osiModule: OsiModule) {
    makeAutoObservable(this);

    autorun(() => {
      const itemsWithDetails = this.reportDialog.selectedAccount?.items?.filter((item) => item.details?.length);

      const errors = [];

      itemsWithDetails?.forEach((item) => {
        const errorDetails = item.details?.filter((detail) => !detail.amount || !detail.categoryId);
        if (errorDetails?.length) {
          errors.push(errorDetails);
        }
      });

      if (errors?.length) {
        this.dialog.editor.isError = true;
      } else {
        this.dialog.editor.isError = false;
      }
    });
  }

  get isFreeMode() {
    return this.osiModule.osiInfo?.registrationType === 'FREE';
  }

  get isLoading() {
    return this.accountReportsModule.isLoading;
  }

  get isGridLoading() {
    return this.dialog.editor.isLoading;
  }

  get isGridError() {
    return this.dialog.editor.isError;
  }

  get allReports() {
    const reports = this.accountReportsModule.allReports;

    return _.sortBy(reports, (report) => report.period).reverse();
  }

  get editingListPeriod() {
    const selectedReport: AccountReport | undefined = _.find(this.allReports, (report) => {
      const listIndex = _.findIndex(report.lists, (list) => list.id === this.reportDialog.selectedAccount?.id);
      if (listIndex === -1) return undefined;

      return report;
    }) as AccountReport | undefined;

    return `${moment(selectedReport?.period).startOf('month').format('DD.MM.YYYY')} - ${moment(selectedReport?.period)
      .endOf('month')
      .format('DD.MM.YYYY')}`;
  }

  get isOpenAcceptDialogOpen() {
    if (this.reportForPublish) return true;

    return false;
  }

  getAllowedCategories(operationType: OperationTypes, accountType: AccountType) {
    return this.accountReportsModule.categories?.filter(
      (category) => category.operationType === operationType && category.accountType === accountType
    );
  }

  cancelPublishReport = () => {
    this.reportForPublish = null;
  };

  initialize = async () => {
    await this.loadReports();
    this.reportDialog = initialReportDialogState;
  };

  loadReports = async () => {
    await this.accountReportsModule.loadAllReports();
  };

  onPublishClick = (report: AccountReport) => {
    this.reportForPublish = report;
  };

  publishReport = async () => {
    if (!this.reportForPublish) {
      logger.error('no publish for report selected');
      return;
    }

    const isAllListsFilled = _.every(this.reportForPublish.lists, 'isFilled');
    if (!isAllListsFilled) {
      notistackExternal.error('common:notAllAccountsFilled');
      return;
    }

    if (this.isFreeMode) {
      try {
        this.dialog.freeMode.isOpen = true;
      } catch (e) {
        notistackExternal.error(e);
      }

      return;
    }

    try {
      const result = await api.PublishAccountReport(this.reportForPublish.id, {});
      notistackExternal.success();
      await this.accountReportsModule.loadReports();
    } catch (e) {
      notistackExternal.error(e);
    } finally {
      this.reportForPublish = null;
    }
  };

  publishReportInFreeMode = async (data: any) => {
    try {
      const monthlyDebt = {
        maintenanceAmount: Number(data.maintenanceAmount) ?? 0,
        savingsAmount: Number(data.savingsAmount) ?? 0,
        parkingAmount: Number(data.parkingAmount) ?? 0
      };

      const result = await api.PublishAccountReport(this.reportForPublish.id, monthlyDebt);
      notistackExternal.success();
      await this.accountReportsModule.loadReports();
    } catch (e) {
      notistackExternal.error(e);
    } finally {
      this.reportForPublish = null;
      this.dialog.freeMode.isOpen = false;
    }
  };

  onEditListClick = async (list: AccountReportList) => {
    try {
      this.reportDialog.selectedAccount = list;

      const listData = await this.loadList(list.id);

      if (!listData) return;

      if (listData.isInPublishedReport) {
        notistackExternal.warning('Счет уже был расшифрован');
        return;
      }

      const { allReports } = this;

      const selectedReport = allReports.find((report) => report.lists?.find((reportList) => reportList.id === list.id));

      if (selectedReport) {
        this.reportDialog.selectedReport = selectedReport;

        const findedList = _.find(this.reportDialog.selectedReport?.lists, (findList) => findList.id === list.id);
        if (findedList) {
          this.reportDialog.selectedAccount.bankStatementVideoUrl = findedList.bankStatementVideoUrl;
        }
      }

      if (listData.isFilled) {
        this.reportDialog.selectedAccount = listData;

        this.applyInitialFilter();

        this.reportDialog.isReadonly = false;
        this.reportDialog.viewMode = ViewMode.Editing;
        this.reportDialog.isOpen = true;
        return;
      }

      this.reportDialog.isReadonly = false;
      this.reportDialog.viewMode = ViewMode.Assign_list;
      this.reportDialog.isOpen = true;
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  applyInitialFilter = () => {
    this.reportDialog.selectedAccount?.items?.forEach((item) => {
      if (!item.categoryId) {
        if (!item.details?.length) {
          item.filled = '';
          return;
        }
        item.filled = 'f';
      } else {
        item.filled = 'f';
      }
    });

    this.onFilterChange(false);

    const isAllItemsFilled = this.reportDialog.selectedAccount?.items?.every((item) => item.filled === 'f');

    if (isAllItemsFilled) {
      this.onFilterChange(true);
    }
  };

  onFilterChange = (checked: boolean) => {
    this.reportDialog.editorFilters.checked = checked;

    if (checked) {
      this.reportDialog.editorFilters.filterModel = initialReportDialogState.editorFilters.filterModel;
    } else {
      this.reportDialog.editorFilters.filterModel = {
        items: [
          {
            columnField: 'filled',
            operatorValue: 'isEmpty'
          }
        ]
      };
    }
  };

  onShowListClick = async (list: AccountReportList) => {
    this.reportDialog.isReadonly = true;

    this.reportDialog.selectedAccount = list;

    if (list.isFilled) {
      const listData = await this.loadList(list.id);

      if (!listData) return;

      this.reportDialog.selectedAccount = listData;

      this.reportDialog.viewMode = ViewMode.Editing;
      this.reportDialog.isOpen = true;
      return;
    }
    this.reportDialog.viewMode = ViewMode.Assign_list;
    this.reportDialog.isOpen = true;
  };

  openAcceptDialog = () => {
    this.dialog.accept.isOpen = true;
  };

  closeAcceptDialog = () => {
    this.dialog.accept.reportForPublish = null;
    this.dialog.accept.isOpen = false;
  };

  closeEditor = () => {
    this.reportDialog.isOpen = false;
  };

  closeAssignList = () => {
    this.reportDialog.isOpen = false;
  };

  editReportList = async (listId: number) => {
    const list = await this.loadList(listId);
    if (!list) return;
    this.dialog.editor.listForEdition = list;
    this.dialog.editor.isOpen = true;
    this.dialog.editor.viewMode = false;
  };

  assignFile = async (file: any) => {
    if (!this.reportDialog.selectedAccount) return;

    const { selectedAccount } = this.reportDialog;

    try {
      const result = await api.AttachAccountReportListByListId(selectedAccount.id, file);
      await this.loadReports();
      const list = await this.loadList(selectedAccount.id);
      if (!list) return;
      this.reportDialog.selectedAccount = list;
      this.changeViewMode(ViewMode.Editing);
    } catch (e) {
      notistackExternal.error(e);
      logger.error(e);
    }
  };

  changeViewMode = (viewMode: ViewMode) => {
    this.reportDialog.viewMode = viewMode;
  };

  loadList = async (listId: number) => {
    try {
      const list = await this.accountReportsModule.loadListById(listId);
      if (!list) return null;
      return list;
    } catch (e) {
      notistackExternal.error(e);
      logger.error(e);
    }
  };

  updateHookForm = (hookForm: any) => {
    this.reportDialog.hookForm = hookForm;
  };

  saveList = async () => {
    const items = this.reportDialog.selectedAccount?.items;

    const cloneItems = _.cloneDeep(items);

    const newItems = cloneItems?.map((item) => {
      const { details, ...emptyDetailsItem } = item;

      if (!details?.length) {
        if (!item.categoryId) {
          item.categoryId = null;
        }

        return item;
      }

      if (!details?.length) {
        if (!item.categoryId) {
          item.categoryId = null;
        }

        return item;
      }

      const newDetails = details
        ?.map((detail: any) => {
          if (detail.isNew) {
            const newDetail = _.pick(detail, ['amount', 'comment', 'categoryId']);

            if (!newDetail.categoryId) {
              newDetail.categoryId = 0;
            }

            return newDetail;
          }

          if (!detail.categoryId) {
            detail.categoryId = null;
          }

          return detail;
        })
        ?.filter((detail) => detail.amount !== null && detail.amount !== 0);

      const newItem = item;

      newItem.details = newDetails;
      newItem.categoryId = null;

      return newItem;
    });

    try {
      this.dialog.editor.isLoading = true;
      const result = await api.UpdateAccountReportListDetails(this.reportDialog.selectedAccount?.id, newItems);
      await this.accountReportsModule.loadReports();
      notistackExternal.success();
      this.closeEditor();
    } catch (e) {
      notistackExternal.error(e);
      logger.error(e);
    } finally {
      this.dialog.editor.isLoading = false;
    }
  };

  showReport = async (report: AccountReport) => {
    this.dialog.viewer.selectedReport = report;
    this.dialog.viewer.isOpen = true;
    this.dialog.editor.isOpen = true;
  };

  selectList = async (list: AccountReportList) => {
    if (!list.isFilled) {
      notistackExternal.error('common:accountReportListNotFilled');
      this.closeViewer();
    }

    try {
      const listInfo = await this.accountReportsModule.loadListById(list.id);
      if (!listInfo) return;

      this.dialog.viewer.selectedList = listInfo;
      this.dialog.editor.viewMode = true;
    } catch (e) {
      notistackExternal.error(e);
      logger.error(e);
    }
  };

  closeViewer = () => {
    this.dialog.viewer.isOpen = false;
    this.dialog.viewer.selectedReport = null;
    this.dialog.viewer.selectedList = null;
    this.dialog.editor.viewMode = false;
  };

  closeSelectList = () => {
    this.closeViewer();
  };

  closeReportDialog = () => {
    this.reportDialog.isOpen = false;
  };

  updateItemCategory = (itemId: number, categoryId: number | null | string | undefined) => {
    const item = _.find(this.reportDialog?.selectedAccount?.items, (item) => item.id === itemId);

    if (!item) return;

    if (!categoryId) {
      item.categoryId = '';
      return;
    }

    item.categoryId = categoryId;
  };

  updateDetailCategoryId = (detailId: number, categoryId: number | null | string | undefined) => {
    const item = _.find(this.reportDialog?.selectedAccount?.items, (item) => {
      const detail = _.find(item?.details, (detail) => detail.id === detailId);

      if (detail) return true;

      return false;
    });

    if (item && item?.details) {
      const detail = _.find(item?.details, (detail) => detail.id === detailId);
      const detailIndex = _.findIndex(item?.details, (detail) => detail.id === detailId);

      if (!detail || detailIndex === -1) return;

      const newDetail = { ...detail, categoryId };

      item.details[detailIndex] = newDetail;
    }
  };

  updateItemDetails = (item: AccountReportListItem, detailsData: any) => {
    const itemIndex = _.findIndex(this.reportDialog.selectedAccount?.items, (elem) => elem.id === item.id);

    if (itemIndex === -1) {
      logger.error('item not found');
      return;
    }
    if (!this.reportDialog.selectedAccount?.items) {
      logger.error('items in selected account not found');
      return;
    }
    const details = this.reportDialog.selectedAccount?.items[itemIndex].details;

    if (!details) {
      logger.error('details in item not found');
      return;
    }

    const detailIndex = _.findIndex(details, (elem) => elem.id === detailsData.id);

    if (detailIndex === -1) {
      details.push(detailsData);
      return;
    }

    if (!details[detailIndex]) {
      logger.error('detail not found');
      return;
    }

    details[detailIndex] = { ...details[detailIndex], ...detailsData };
  };

  deleteDetail = (detailId: any) => {
    this.reportDialog.selectedAccount?.items?.forEach((item) => {
      const { details } = item;

      if (!details) {
        return;
      }

      _.remove(details, (detail) => detail.id === detailId);
    });
  };

  showReportListByReportId = async (reportId: number) => {
    const report = this.allReports.find((report) => report.id === reportId);

    if (!report?.docs?.[0]?.scan?.id) return;

    const scanId = report.docs[0].scan.id;
    const base64doc = (await api.getScanDoc(scanId)) as unknown as string;
    openPdfDoc(base64doc);
  };
}
