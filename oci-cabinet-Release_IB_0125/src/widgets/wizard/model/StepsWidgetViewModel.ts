import { injectable } from 'inversify';
import { autorun, makeAutoObservable } from 'mobx';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';
import _ from 'lodash';
import api from '@app/api';
import { OsiModule } from '@mobx/services/osiModule';
import { OsiAccount } from '@shared/types/osi';
import { Abonent } from '@shared/types/osi/abonents';
import { lastStep } from '@widgets/wizard/config';

@injectable()
export class StepsWidgetViewModel {
  wizardStep: any;

  isLoading = false;

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);

    this.wizardStep = 0;

    autorun(() => {
      if (!this.osiModule.osiId) {
        this.isLoading = true;
      } else {
        this.isLoading = false;
      }
    });

    autorun(() => {
      if (this.osiModule.isLoading) return;

      if (!this.osiModule.osiInfo?.wizardStep) {
        this.wizardStep = 0;
        return;
      }

      const { wizardStep } = this.osiModule.osiInfo;

      if (wizardStep === 'finish') {
        this.wizardStep = 'finish';
        return;
      }

      const currentStep = Number(wizardStep);

      if (_.isFinite(currentStep)) {
        this.wizardStep = currentStep;
      } else {
        this.wizardStep = 0;
      }

      if (currentStep > lastStep) {
        this.wizardStep = lastStep;
      }
    });
  }

  private _accounts: OsiAccount[] = [];

  get accounts() {
    return this._accounts;
  }

  set accounts(accounts: OsiAccount[]) {
    this._accounts = accounts;
  }

  private _abonents: Abonent[] = [];

  get abonents() {
    return this._abonents;
  }

  set abonents(abonents) {
    this._abonents = abonents;
  }

  get isAllAbonentsFilled() {
    if (this._abonents.length < 2) return false;

    return this._abonents.every((abonent) => abonent.square);
  }

  get isOsiInfoFilled() {
    if (!this.osiModule.osiInfo) return false;
  }

  nextStep = () => {
    this.wizardStep += 1;
    this.updateStep();
  };

  prevStep = () => {
    this.wizardStep -= 1;
    this.updateStep();
  };

  finish = async () => {
    try {
      if (!this.osiModule.osiId) throw new Error('OsiId is undefined');

      this.isLoading = true;

      await api.OsiWizardStep(this.osiModule.osiId, 'finish');
      await this.osiModule.selectOsi(this.osiModule.osiId);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  updateStep = async () => {
    try {
      if (!this.osiModule.osiId) throw new Error('OsiId is undefined');

      this.isLoading = true;

      await api.OsiWizardStep(this.osiModule.osiId, String(this.wizardStep));
      await this.osiModule.selectOsi(this.osiModule.osiId);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };
}
