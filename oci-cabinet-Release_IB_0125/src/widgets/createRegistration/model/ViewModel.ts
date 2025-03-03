import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { ICreateRegistrationWidgetViewModel } from '@shared/types/mobx/widgets/CreateRegistrationWidget';
import { ProfileModule } from '@mobx/services/profile';
import { NavigateFunction } from 'react-router-dom';
import { RegistrationModule } from '@mobx/services/registration';

@injectable()
export class CreateRegistrationWidgetViewModel implements ICreateRegistrationWidgetViewModel {
  isSelectRegistrationTypeModalOpen = false;

  isLastCreatedRegistrationContinueModalOpen = false;

  constructor(private profileModule: ProfileModule, private registrationModule: RegistrationModule) {
    makeAutoObservable(this);
  }

  private _navigate: NavigateFunction | null = null;

  set navigate(value: NavigateFunction) {
    this._navigate = value;
  }

  get fio() {
    return this.profileModule.userData.info?.fio ?? '...';
  }

  createRegistrationButtonClicked = () => {
    this.isSelectRegistrationTypeModalOpen = false;

    const lastCreatedRegistration = this.registrationModule.getRegistrationForContinue();

    if (!lastCreatedRegistration) {
      this.registrationModule.createNewRegistration();
      return;
    }

    this.openLastCreatedRegistration();
  };

  closeRegistrationTypeModal = () => {
    this.isSelectRegistrationTypeModalOpen = false;
  };

  onFreeTypeClick = () => {
    this.isSelectRegistrationTypeModalOpen = false;

    this.registrationModule.createFreeRegistration();
  };

  onFullTypeClick = () => {
    this.isSelectRegistrationTypeModalOpen = false;

    this.registrationModule.createNewRegistration();
  };

  closeLastCreatedRegistrationContinueModal = () => {
    this.isLastCreatedRegistrationContinueModalOpen = false;
  };

  openLastCreatedRegistration = () => {
    this.isLastCreatedRegistrationContinueModalOpen = true;
  };

  createNewRegistration = () => {
    this.registrationModule.createNewRegistration();
    this.closeLastCreatedRegistrationContinueModal();
  };

  continueLastCreatedRegistration = () => {
    this.registrationModule.continueNotFinishedRegistration();
    this.closeLastCreatedRegistrationContinueModal();
  };
}
