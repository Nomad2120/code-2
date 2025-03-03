import { makeAutoObservable } from 'mobx';
import { OsiModule } from '@mobx/services/osiModule';
import { AccountReportsModule } from '@mobx/services/osi/accountReports';
import { injectable } from 'inversify';

@injectable()
export class OsiRootViewModel {
  changeModeModalIsOpen = false;

  constructor(private osiModule: OsiModule, private accountReportsModule: AccountReportsModule) {
    makeAutoObservable(this);
  }

  get osiName() {
    return this.osiModule.osiInfo?.name;
  }

  get osiAddress() {
    return this.osiModule.osiInfo?.address;
  }

  get isLoading() {
    return this.osiModule.isLoading;
  }

  get menuItems() {
    return this.osiModule.menuItems;
  }

  get isFreeMode() {
    return this.osiModule.osiInfo?.registrationType === 'FREE';
  }

  openChangeModeModal = () => {
    this.changeModeModalIsOpen = true;
  };

  closeChangeModeModal = () => {
    this.changeModeModalIsOpen = false;
  };

  onChangeModeClicked = () => {
    this.closeChangeModeModal();
  };

  loadOsiAccountReports = async () => {
    if (!this.osiModule.osiInfo?.id) return;

    await this.accountReportsModule.loadReports();
  };
}
