import { injectable } from 'inversify';
import { autorun, makeAutoObservable, reaction } from 'mobx';
import { queryClient } from '@shared/api/reactQuery';
import {
  getGetApiRegistrationsIdQueryKey,
  getGetApiRegistrationsIdQueryOptions,
  getGetApiRegistrationsReqdocsQueryKey,
  getGetApiRegistrationsReqdocsQueryOptions,
  getPutApiRegistrationsIdWizardStepMutationOptions
} from '@shared/api/orval/registrations/registrations';
import { DbRegistration } from '@shared/api/orval/models';
import { NavigateFunction } from 'react-router-dom';
import { PATH_CABINET } from '@app/routes/paths';
import { getGetApiUsersIdRegistrationsQueryKey } from '@shared/api/orval/users/users';
import { ProfileModule } from '@mobx/services/profile';
import { wizardSteps } from '@widgets/registrationWizard/config/steps';
import { isEqual } from 'lodash';

@injectable()
export class RegistrationWizardViewModel {
  location: any = null;

  navigate: NavigateFunction | null = null;

  registration: DbRegistration | null = null;

  wizardStep: number | undefined = undefined;

  isPrevStepAllowed = true;

  isLoading = false;

  isFinishStep = false;

  isFinishAllowed = false;

  _mutationCache = queryClient.getMutationCache();

  _queryCache = queryClient.getQueryCache();

  isNextStepAllowed = false;

  wizardSteps = wizardSteps;

  private _disposeAllReactionsController = new AbortController();

  constructor(private _profileModule: ProfileModule) {
    makeAutoObservable(this);

    reaction(
      () => this.location,
      (location) => {
        if (!location?.state?.registrationId) {
          this.registration = null;
        }
      },
      { signal: this._disposeAllReactionsController.signal }
    );

    autorun(
      async () => {
        if (!this.location) return;

        try {
          this.isLoading = true;
          await this.loadRegistrationData();
        } finally {
          this.isLoading = false;
        }
      },
      { signal: this._disposeAllReactionsController.signal }
    );

    autorun(
      async () => {
        try {
          this.isLoading = true;
          await this.defineWizardSteps();
        } finally {
          this.isLoading = false;
        }
      },
      { signal: this._disposeAllReactionsController.signal }
    );

    autorun(
      () => {
        this.wizardStep = Number(this.registration?.wizardStep ?? 0);
      },
      { signal: this._disposeAllReactionsController.signal }
    );

    this._queryCache.subscribe(({ query }) => {
      const getRegistrationKey = getGetApiRegistrationsIdQueryKey(this.registration?.id ?? 0);
      if (query.queryKey[0] === getRegistrationKey[0]) {
        if (query.state.fetchStatus === 'fetching') this.isLoading = true;

        if (!query.state.data?.result) return;

        if (isEqual(this.registration, query.state.data.result)) return;

        this.registration = query.state.data.result;
        this.isLoading = false;
      }
    });
  }

  cleanup = () => {
    this._disposeAllReactionsController.abort();
  };

  prevStep = async () => {
    if (!this.wizardStep) return;

    const wizardStepMutation = this._mutationCache.build(
      queryClient,
      getPutApiRegistrationsIdWizardStepMutationOptions()
    );

    try {
      this.isLoading = true;

      const result = await wizardStepMutation.execute({
        id: this.registration?.id ?? 0,
        data: (this.wizardStep - 1).toString()
      });
      if (result.code !== 0) return;

      await queryClient.refetchQueries({ queryKey: getGetApiRegistrationsIdQueryKey(this.registration?.id ?? 0) });
    } catch (e) {
      this.isLoading = false;
    }
  };

  nextStep = async () => {
    if ((this.wizardStep ?? 0) >= this.wizardSteps.length) return;

    const wizardStepMutation = this._mutationCache.build(
      queryClient,
      getPutApiRegistrationsIdWizardStepMutationOptions()
    );
    try {
      this.isLoading = true;
      const result = await wizardStepMutation.execute({
        id: this.registration?.id ?? 0,
        data: ((this.wizardStep ?? 0) + 1).toString()
      });
      if (result.code !== 0) return;

      await queryClient.refetchQueries({ queryKey: getGetApiRegistrationsIdQueryKey(this.registration?.id ?? 0) });
    } catch (e) {
      this.isLoading = false;
    }
  };

  finish = async () => {
    const wizardStepMutation = this._mutationCache.build(
      queryClient,
      getPutApiRegistrationsIdWizardStepMutationOptions()
    );

    try {
      this.isLoading = true;
      const result = await wizardStepMutation.execute({
        id: this.registration?.id ?? 0,
        data: 'finish'
      });
      if (result.code !== 0) return;

      this.navigate?.(PATH_CABINET.root);
      await queryClient.refetchQueries({
        queryKey: getGetApiUsersIdRegistrationsQueryKey(this._profileModule.userData.id)
      });
    } catch (e) {
      this.isLoading = false;
    }
  };

  private defineWizardSteps = async () => {
    if (!this.registration?.id) return;

    const registrationId = this.registration?.id;

    const requiredDocsResponse = await queryClient.fetchQuery(
      getGetApiRegistrationsReqdocsQueryOptions(
        { registrationId },
        {
          query: {
            queryKey: [...getGetApiRegistrationsReqdocsQueryKey({ registrationId }), `${this.registration.unionTypeId}`]
          }
        }
      )
    );

    const isNeedAccountsStep = requiredDocsResponse?.result?.some((reqDoc) => reqDoc.code === 'CURRENT_IBAN_INFO');

    if (!isNeedAccountsStep) {
      this.wizardSteps = wizardSteps.filter((step) => step.code !== 'accounts');
    } else {
      this.wizardSteps = wizardSteps;
    }
  };

  private loadRegistrationData = async () => {
    const selectedRegistrationId = this.location?.state?.registrationId;
    if (!selectedRegistrationId) return;

    const data = await queryClient.fetchQuery(getGetApiRegistrationsIdQueryOptions(selectedRegistrationId));
    if (!data.result) return;

    this.registration = data.result;
  };
}

export const token = Symbol.for('IRegistrationWizardViewModel');
