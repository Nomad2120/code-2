import { makeAutoObservable, when } from 'mobx';
import moment from 'moment';
import { injectable } from 'inversify';
import { isHydrated, makePersistable } from 'mobx-persist-store';

const WAITING_TIME_MINUTES = 3;

@injectable()
export class TimerState {
  isButtonDisabled = false;

  countdown = 0;

  intervalId: any = null;

  endTime: any = null;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, { name: 'TimerState', properties: ['endTime'] });

    when(
      () => isHydrated(this),
      () => {
        if (this.endTime && moment(this.endTime) > moment()) {
          this.startTimer();
        }
      }
    );
  }

  startTimer = () => {
    if (this.endTime && moment(this.endTime) > moment()) {
      this.isButtonDisabled = true;

      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      this.intervalId = setInterval(() => {
        this.countdown = Math.round((moment(this.endTime) - moment()) / 1000);
        if (this.countdown <= 0 || !this.countdown) {
          this.cleanupTimer();
        }
      }, 1000);
    }
  };

  cleanupTimer = () => {
    clearInterval(this.intervalId);
    this.isButtonDisabled = false;
    this.endTime = null;
  };

  handleClick = () => {
    this.endTime = moment().add(WAITING_TIME_MINUTES, 'minutes');
    this.startTimer();
  };
}
