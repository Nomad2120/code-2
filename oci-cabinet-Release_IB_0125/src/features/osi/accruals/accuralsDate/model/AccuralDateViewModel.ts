import { injectable } from 'inversify';
import { autorun, makeAutoObservable } from 'mobx';
import { IAccuralDateViewModel } from '@shared/types/mobx/features/OsiAccuralDate';
import { getLastPlanOrCreateNew } from '@shared/api/osi/accruals';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { OsiModule } from '@mobx/services/osiModule';
import logger from 'js-logger';
import { PlanAccural } from '@shared/types/osi/accurals';
import { setAccuralJobAtDay } from '@shared/api/planAccurals';
import moment from 'moment';

const getDaysArray = (isCompleted: boolean) => {
  const datesArray = [];

  if (isCompleted) {
    const firstDate = moment().startOf('month');
    const endDate = moment().startOf('month').add(9, 'day');

    const diff = endDate.diff(firstDate, 'days');

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= diff; i++) {
      datesArray.push(moment(firstDate).add(i, 'day').format('DD'));
    }

    return datesArray;
  }

  const firstDate = moment().add(1, 'day');
  const isAfter = firstDate.isAfter(moment().startOf('month').add(9, 'day'));

  // если начальная дата больше 10, то отображать только 10 дат
  if (isAfter) {
    const endDate = moment().date(10);

    const diff = endDate.diff(moment().startOf('month'), 'days');

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= diff; i++) {
      datesArray.push(moment().startOf('month').add(i, 'day').format('DD'));
    }

    return datesArray;
  }

  const endDate = moment().date(10);

  const diff = endDate.diff(firstDate, 'days');

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i <= diff; i++) {
    datesArray.push(moment(firstDate).add(i, 'day').format('DD'));
  }

  return datesArray;
};

@injectable()
export class AccuralDateViewModel implements IAccuralDateViewModel {
  isModalOpen = false;

  private _plan: PlanAccural | null = null;

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);

    void this.loadPlan();

    autorun(() => {
      const date = this._plan?.accuralJobAtDay.toString().padStart(2, '0');
      this._hookForm?.reset({ date });
    });
  }

  private _hookForm: any = null;

  set hookForm(value: any) {
    this._hookForm = value;
  }

  get accuralJobDay() {
    const day = this._plan?.accuralJobAtDay ?? 0;
    return day.toString().padStart(2, '0');
  }

  get allowedDates() {
    const isPlanCompleted = this._plan?.accuralCompleted ?? false;
    return getDaysArray(isPlanCompleted);
  }

  loadPlan = async () => {
    try {
      if (!this.osiModule.osiInfo?.id) throw new Error('osiId is undefined');
      this._plan = await getLastPlanOrCreateNew(this.osiModule.osiInfo?.id);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  updatePlanDate = async () => {
    try {
      if (!this._plan?.id) throw new Error('planId is undefined');
      const newDate = this._hookForm.getValues().date;

      await setAccuralJobAtDay(this._plan.id, parseInt(newDate, 10));
      await this.loadPlan();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
      this.cancelChangeDate();
    } finally {
      this.closeModal();
    }
  };

  onDateChanged = () => {
    this.openModal();
  };

  openModal = () => {
    this.isModalOpen = true;
  };

  cancelChangeDate = () => {
    this._hookForm.reset({ date: this.accuralJobDay });
    this.closeModal();
  };

  closeModal = () => {
    this.isModalOpen = false;
  };
}
