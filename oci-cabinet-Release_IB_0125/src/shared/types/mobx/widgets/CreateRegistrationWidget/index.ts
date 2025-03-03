import { NavigateFunction } from 'react-router-dom';

export interface ICreateRegistrationWidgetViewModel {
  fio: string;
  isSelectRegistrationTypeModalOpen: boolean;
  createRegistrationButtonClicked: () => void;
  closeRegistrationTypeModal: () => void;
  onFreeTypeClick: () => void;
  onFullTypeClick: () => void;

  isLastCreatedRegistrationContinueModalOpen: boolean;
  closeLastCreatedRegistrationContinueModal: () => void;
  openLastCreatedRegistration: () => void;
  createNewRegistration: () => void;
  continueLastCreatedRegistration: () => void;

  navigate: NavigateFunction;
}

export const ICreateRegistrationWidgetViewModelToken = Symbol.for('ICreateRegistrationWidgetViewModel');
