import { RegistrationKinds } from '@shared/types/registration';
import { injectable } from 'inversify';
import { makeAutoObservable, reaction } from 'mobx';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { RegistrationWizardViewModel } from '@widgets/registrationWizard/store/RegistrationWizardViewModel';
import { NavigateFunction } from 'react-router-dom';
import { PATH_CABINET } from '@app/routes/paths';
import { queryClient } from '@shared/api/reactQuery';
import { getPutApiRegistrationsIdConfirmCreationMutationOptions } from '@shared/api/orval/registrations/registrations';
import { EnumsRegistrationStateCodes } from '@shared/api/orval/models';

export type RegistrationModals = RegistrationKinds.CHANGE_UNION_TYPE | RegistrationKinds.CHANGE_CHAIRMAN;

@injectable()
export class RegistrationModalsViewModel {
  wizard: RegistrationWizardViewModel | null = null;

  navigate: NavigateFunction | null = null;

  private _openedModals = new Set<RegistrationModals>();

  private _mutationCache = queryClient.getMutationCache();

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.wizard?.registration,
      (registration, prev) => {
        if (!registration?.registrationKind || !registration?.stateCode) return;
        const { stateCode, wizardStep } = registration;
        if (stateCode !== EnumsRegistrationStateCodes.PREPARED) return;

        // if (registration?.registrationKind === prev?.registrationKind) return;
        // if (registration?.stateCode === prev?.stateCode) return;

        // const { stateCode, wizardStep } = registration;

        if (!!wizardStep && Number(wizardStep) < 1) return;

        this.processingRegistrationKind();
      }
    );
  }

  openModal = (modalName: RegistrationModals) => {
    this._openedModals.add(modalName);
  };

  closeModals = () => {
    this._openedModals.clear();
  };

  isModalOpen = (modalName: RegistrationModals) => {
    const result = this._openedModals.has(modalName);
    return result;
  };

  cancelConfirmRegistration = (e: any, reason?: string) => {
    if (reason === 'backdropClick') return;

    this.closeModals();

    this.wizard?.prevStep();

    // this.navigate?.(PATH_CABINET.root);
  };

  confirmRegistration = async () => {
    try {
      const regId = this.wizard?.registration?.id;

      if (!regId) return;

      const confirmCreation = this._mutationCache.build(
        queryClient,
        getPutApiRegistrationsIdConfirmCreationMutationOptions()
      );

      await confirmCreation.execute({ id: regId });
      this.closeModals();
      // this.wizard?.nextStep();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  private processingRegistrationKind = () => {
    if (!this.wizard?.registration?.id) return;

    const { registrationKind } = this.wizard.registration;

    if (!registrationKind) return;

    this.openModal(registrationKind as RegistrationModals);
  };
}
