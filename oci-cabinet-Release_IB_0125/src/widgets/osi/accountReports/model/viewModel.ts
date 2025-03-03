import { injectable } from 'inversify';
import { autorun, makeAutoObservable } from 'mobx';
import { AccountReportsModule } from '@mobx/services/osi/accountReports';
import logger from 'js-logger';
import {
  AccountListLastMonth,
  AccountReportLastMonth,
  AccountReportList,
  AccountReportListItem,
  OperationTypes
} from '@shared/types/osi/accountReports';
import { Nullable } from '@shared/types/utils';
import api from '@app/api';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import _ from 'lodash';
import { ReportDialog, ViewMode } from '@widgets/osi/accountReports/ReportDialog/model/type';
import moment from 'moment';
import { OsiModule } from '@mobx/services/osiModule';

export interface Account {
  id: number;
  bankName?: string;
  accountTypeNameRu?: string;
  accountTypeNameKz?: string;
  osiId: number;
  type: AccountType;
  bic: string;
  account: string;
}

export type AccountType = 'SAVINGS' | 'CURRENT';

const initialReportDialogState: ReportDialog = {
  isOpen: false,
  viewMode: ViewMode.Entry,
  selectedAccount: null,
  editorFilters: {
    checked: false,
    filterModel: { items: [] }
  },
  selectedReport: null,
  hookForm: null,
  isReadonly: false
};

@injectable()
export class AccountReportsViewModel {
  isOpen = false;

  isError = false;

  isLoading = false;

  selectedAccount: AccountListLastMonth | null = null;

  accountList: AccountReportList | null = null;

  hookForm: any = null;

  reportDialog = initialReportDialogState;

  freeMode = {
    isOpen: false
  };

  constructor(private accountReportsModule: AccountReportsModule, private osiModule: OsiModule) {
    makeAutoObservable(this);

    autorun(async () => {
      if (this.selectedAccount && this.reportDialog.viewMode === ViewMode.Editing) {
        await this.getAccountReportList();
        this.hookForm.reset({ items: this.accountList?.items?.map((item) => _.pick(item, 'id', 'details')) });
      }
    });

    autorun(async () => {
      if (this.reportDialog.viewMode === ViewMode.Select_account) {
        await this.accountReportsModule.updateLastReportData();
      }
    });

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
        this.isError = true;
      } else {
        this.isError = false;
      }
    });
  }

  get isGridLoading() {
    return this.isLoading;
  }

  get isGridError() {
    return this.isError;
  }

  get lastMonthReport(): Nullable<AccountReportLastMonth> {
    const { lastMonthReport } = this.accountReportsModule;

    return lastMonthReport;
  }

  get accounts(): AccountListLastMonth[] {
    return this.lastMonthReport?.lists ?? [];
  }

  get osiInfo() {
    return this.accountReportsModule.osiInfo;
  }

  get lastMonthFilledListsCount(): number {
    if (!this.lastMonthReport || !this.lastMonthReport.lists) return 0;

    const filledLists = this.lastMonthReport.lists?.filter((list) => list.isFilled);
    return filledLists?.length;
  }

  get allListsFilled(): boolean {
    if (!this.lastMonthReport || !this.lastMonthReport.lists) return false;

    return this.lastMonthFilledListsCount === this.lastMonthReport.lists.length;
  }

  get editingListPeriod() {
    return `${moment().subtract(1, 'month').startOf('month').format('DD.MM.YYYY')} - ${moment()
      .subtract(1, 'month')
      .endOf('month')
      .format('DD.MM.YYYY')}`;
  }

  get isFreeMode() {
    return this.osiModule.osiInfo?.registrationType === 'FREE';
  }

  getAllowedCategories(operationType: OperationTypes, accountType: AccountType) {
    return this.accountReportsModule.categories?.filter(
      (category) => category.operationType === operationType && category.accountType === accountType
    );
  }

  initialize = async () => {
    this.reset();
    await this.accountReportsModule.loadLastMonthReport();

    if (!this.lastMonthReport || this.osiInfo.unionTypeId === 4) {
      logger.error('lastMonthReport not found');
      return;
    }

    if (this.lastMonthReport.state === 'PUBLISHED') {
      return;
    }

    if (this.osiModule.isLockedMenus) {
      return;
    }

    this.reportDialog.viewMode = ViewMode.Entry;
    this.reportDialog.isOpen = true;
  };

  reset = () => {
    this.reportDialog = initialReportDialogState;
    this.freeMode.isOpen = false;
  };

  updateHookForm = (hookForm: any) => {
    this.reportDialog.hookForm = hookForm;
  };

  closeDialog = () => {
    this.reportDialog.isOpen = false;
  };

  changeViewMode = (viewMode: ViewMode) => {
    this.reportDialog.viewMode = viewMode;
  };

  selectAccount = async (account: AccountListLastMonth) => {
    const listData = await this.loadAccount(account.id);

    if (!listData) {
      logger.error('not loaded list extended info');
      return;
    }

    if (listData.isInPublishedReport) {
      notistackExternal.warning('Счет уже был расшифрован');
      return;
    }

    this.reportDialog.selectedReport = this.lastMonthReport as any;

    const list = _.find(this.reportDialog.selectedReport?.lists, (list) => list.id === listData.id);
    if (list) {
      listData.bankStatementVideoUrl = list.bankStatementVideoUrl;
    }

    this.reportDialog.selectedAccount = listData;

    this.applyInitialFilter();

    if (this.reportDialog.selectedAccount.isFilled) {
      this.changeViewMode(ViewMode.Editing);
      return;
    }

    this.changeViewMode(ViewMode.Assign_list);
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

  loadAccount = async (listId: number) => {
    try {
      const list = await this.accountReportsModule.loadListById(listId);
      if (!list) return null;
      return list;
    } catch (e) {
      notistackExternal.error(e);
      logger.error(e);
    }
  };

  getAccountReportList = async () => {
    if (!this.selectedAccount) return;
    const resultList = (await api.GetAccountReportListByListId(
      this.selectedAccount.id
    )) as unknown as AccountReportList;
    this.accountList = resultList;
  };

  publishReport = async () => {
    try {
      if (this.isFreeMode) {
        try {
          this.freeMode.isOpen = true;
        } catch (e) {
          notistackExternal.error(e);
        }

        return;
      }

      await api.PublishAccountReport(this.lastMonthReport?.id, {});
      this.closeReportDialog();
      this.reset();
    } catch (e) {
      logger.error(e);
      notistackExternal.error(e);
    }
  };

  publishReportInFreeMode = async (data: any) => {
    try {
      const monthlyDebt = {
        maintenanceAmount: Number(data.maintenanceAmount) ?? 0,
        savingsAmount: Number(data.savingsAmount) ?? 0,
        parkingAmount: Number(data.parkingAmount) ?? 0
      };

      await api.PublishAccountReport(this.lastMonthReport?.id, monthlyDebt);
      notistackExternal.success();
      this.closeReportDialog();
      this.reset();
    } catch (e) {
      notistackExternal.error(e);
    }
  };

  assignFile = async (file: any) => {
    if (!this.reportDialog.selectedAccount) return;

    try {
      const result = await api.AttachAccountReportListByListId(this.reportDialog.selectedAccount.id, file);
      await this.accountReportsModule.loadLastMonthReport();
      this.reportDialog.selectedReport = this.lastMonthReport as any;
      await this.selectAccount(this.reportDialog.selectedAccount);
    } catch (e) {
      notistackExternal.error(e);
      logger.error(e);
    }
  };

  saveList = async () => {
    const items = this.reportDialog.selectedAccount?.items;

    const cloneItems = _.cloneDeep(items);

    const newItems = cloneItems?.map((item) => {
      const { details } = item;

      if (!details?.length) {
        if (!item.categoryId) {
          item.categoryId = null;
        }

        const { details, ...emptyDetailsItem } = item;

        return item;
      }

      const newDetails = details
        ?.map((detail: any) => {
          if (detail.isNew) {
            const newDetail = _.pick(detail, ['amount', 'comment', 'categoryId']);

            if (!newDetail.categoryId) {
              return _.pick(newDetail, ['amount', 'comment']);
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
      this.isLoading = true;
      const result = await api.UpdateAccountReportListDetails(this.reportDialog.selectedAccount?.id, newItems);
      await this.accountReportsModule.loadLastMonthReport();
      notistackExternal.success();
      this.changeViewMode(ViewMode.Select_account);
    } catch (e) {
      notistackExternal.error(e);
      logger.error(e);
    } finally {
      this.isLoading = false;
    }
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
}
