import { makeAutoObservable, reaction } from 'mobx';
import { tokens } from '@shared/utils/i18n';
import { injectable } from 'inversify';
import { RegistrationModule } from '@mobx/services/registration';
import { RegistrationDocsViewModel } from '@widgets/registration/docs/model/RegistrationDocsViewModel';
import { steps } from '@widgets/registration/config/steps';
import { isEmpty, replace as _replace } from 'lodash';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import {
  RegistrationCreatePayload,
  RegistrationEditPayload
} from '@entities/registration/RegistrationForm/model/model';
import { SettingsStore } from '@mobx/services/SettingsStore';
import api from '@app/api';
import { AuthModule } from '@mobx/services/auth';
import { PATH_CABINET } from '@app/routes/paths';
import { HistoryModule } from '@mobx/services/history';
import {
  confirmCreationRegistration,
  getRegistrationById,
  signWithoutDoc,
  updateWizardStep
} from '@shared/api/registration';
import { RegistrationAccount, RegistrationKinds } from '@shared/types/registration';
import { RegistrationStateCode, ReqDocCodes } from '@mobx/interfaces';

const DEFAULT_MODE = 'FREE';

export type RegistrationModals = RegistrationKinds.CHANGE_UNION_TYPE | RegistrationKinds.CHANGE_CHAIRMAN;

// TODO: реакции отрабатывают в рандомном порядке - нужно переписать так, чтобы была синхронизация с wizardStep с бэком
@injectable()
export class RegistrationViewModel {
  currentStep: any = 0;

  formik: any;

  isLoading = false;

  private _isRequiredDocsFilled = false;

  private _openedModals = new Set<RegistrationModals>();

  private _createdRegistrationId: number | null = null;

  constructor(
    private registrationModule: RegistrationModule,
    private registrationDocsViewModel: RegistrationDocsViewModel,
    private settingsStore: SettingsStore,
    private authModule: AuthModule,
    private history: HistoryModule
  ) {
    makeAutoObservable(this);
    this.currentStep = 0;

    // Установка текущего шага в зависимости от режима - можно вынести в метод
    reaction(
      () => this.registrationModule.status,
      (value, prev) => {
        if (prev === value) return;

        if (this.registrationModule.status === 'Create') {
          this.currentStep = 0;
        }
        if (this.registrationModule.status === 'Edit') {
          const step = this.registrationModule.selectedRegistration?.wizardStep;
          if (!step) {
            this.currentStep = 0;
            return;
          }

          if (step === 'finish') {
            this.currentStep = this.getSteps().length;
            return;
          }

          this.currentStep = Number(step);
        }
      },
      { fireImmediately: true }
    );

    // установка типа регистрации (устарело) при выборе регистрации
    reaction(
      () => this.registrationModule.selectedRegistration?.id,
      (value) => {
        if (!value) return;

        this.regType = this.registrationModule.selectedRegistration?.registrationType;
      },
      { fireImmediately: true }
    );

    reaction(
      () => [
        this.registrationModule.selectedRegistration?.id,
        this.registrationModule.selectedRegistration?.registrationKind,
        this.currentStep
      ],
      ([id, regKind]) => {
        if (!id || !regKind) return;

        // @ts-expect-error тип устарел, он содержит эти поля
        const { stateCode, registrationKind, wizardStep } = this.registrationModule.selectedRegistration;

        if (stateCode !== RegistrationStateCode.PREPARED) return;

        if (wizardStep === 0) return;

        this.openModal(registrationKind);
      }
    );
  }

  private _accounts: RegistrationAccount[] = [];

  set accounts(value: RegistrationAccount[]) {
    this._accounts = value;
  }

  get isEditMode() {
    return this.registrationModule?.status === 'Edit';
  }

  get isCreateMode() {
    return this.registrationModule?.status === 'Create';
  }

  private _regType: 'FREE' | 'FULL' = 'FREE';

  set regType(value: 'FREE' | 'FULL' | undefined) {
    if (this.isEditMode) {
      this._regType = this.registrationModule.selectedRegistration?.registrationType ?? DEFAULT_MODE;
      return;
    }

    if (!value) {
      this._regType = DEFAULT_MODE;
      return;
    }

    this._regType = value;
  }

  get heading(): string {
    return this.registrationModule.selectedRegistration !== null
      ? tokens.cabinetRoot.registration.view
      : tokens.cabinetRoot.registration.re;
  }

  get isFinishStep(): boolean {
    return this.currentStep === this.getSteps().length - 1;
  }

  get prevStepAllowed(): boolean {
    return this.currentStep > 0;
  }

  get nextStepAllowed(): boolean {
    if (this.currentStep === 0) {
      if (this.formik?.isValid && isEmpty(this.formik?.errors)) return true;
      return false;
    }

    if (this.currentStep === 1) {
      return this._isRequiredDocsFilled;
    }

    if (this.currentStep === 2) {
      // Если прикреплен документ сбер счета - проверять что сбер счет заполнен
      const currentDocs = this.registrationModule.selectedRegistration?.docs;

      const isSavingIbanInfoDocExists = currentDocs?.filter(
        // @ts-expect-error next-line
        (doc) => doc.docTypeCode === ReqDocCodes.SAVING_IBAN_INFO
      )?.[0];

      if (isSavingIbanInfoDocExists) return this._accounts.length > 1;

      return this._accounts.length > 0;
    }

    return !this.isFinishStep;
  }

  get isFinishAllowed(): boolean {
    if (this._regType === 'FREE') {
      return this._accounts.length > 0;
    }
    return true;
  }

  get nextStepDisabled(): boolean {
    return false;
  }

  syncFormik = (formik: any) => {
    this.formik = formik;
  };

  nextStep = async (): Promise<void> => {
    if (this.currentStep + 1 >= steps.length) return;

    try {
      this.isLoading = true;
      if (this.currentStep === 0) {
        await this.saveOsiInfo();
      }

      if (this.currentStep === 1) {
        await this.registrationDocsViewModel.saveDocs();
      }

      // eslint-disable-next-line no-plusplus
      this.currentStep++;

      if (!this.registrationModule.selectedRegistration?.id) return;

      await updateWizardStep(this.registrationModule.selectedRegistration?.id, this.currentStep);
    } catch (e) {
      logger.error(e, { details: 'registrationVM nextStep' });
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  saveOsiInfo = async () => {
    try {
      if (this.registrationModule.selectedRegistration !== null) {
        await this.updateOsiInfo();
      } else {
        await this.createOsiInfo();
      }
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  updateOsiInfo = async () => {
    if (!this.formik?.values) return;

    const { values, dirty } = this.formik;

    // if (dirty) {
    //   await this.createOsiInfo();
    //   if (this.registrationModule?.status) this.registrationModule.status = 'Create';
    //   return;
    // }

    const payload = {} as RegistrationEditPayload;
    const { selectedRegistration } = this.registrationModule;

    if (!selectedRegistration?.userId || !selectedRegistration?.id) {
      notistackExternal.error('common:noUser');
      return;
    }

    if (!values.apartCount || !values.fio || !values.idn || !values.name || !values.unionTypeId || !values.phone) {
      notistackExternal.error('common:notFullDataError');
      return;
    }

    payload.apartCount = Number(values.apartCount);
    payload.email = values.email;
    payload.fio = values.fio;
    payload.idn = values.idn;
    payload.name = values.name;
    payload.unionTypeId = Number(values.unionTypeId);
    payload.phone = _replace(_replace(values.phone, '+7 7', '7'), new RegExp(' ', 'g'), '');
    payload.addressRegistryId = values.arInfo.building.id;
    payload.atsId = values.arInfo.ats.id;
    payload.rca = values.arInfo.building.rca;
    payload.address = values.arInfo.building.shortPathRus;
    payload.userId = selectedRegistration?.userId;
    payload.id = selectedRegistration?.id;
    payload.registrationType = this._regType;

    try {
      await api.RegistrationUpdate(payload.id, payload);
      await this.registrationModule.loadAllRegistrations();
      await this.registrationModule.selectRegistration(payload.id);
      notistackExternal.success();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  createOsiInfo = async () => {
    if (!this.formik?.values) return;

    const { values } = this.formik;
    const payload = {} as RegistrationCreatePayload;

    if (!this.authModule.id) {
      notistackExternal.error('common:noUser');
      return;
    }

    if (!values.apartCount || !values.fio || !values.idn || !values.name || !values.unionTypeId || !values.phone) {
      notistackExternal.error('common:notFullDataError');
      return;
    }

    payload.apartCount = Number(values.apartCount);
    payload.email = values.email;
    payload.fio = values.fio;
    payload.idn = values.idn;
    payload.name = values.name;
    payload.unionTypeId = Number(values.unionTypeId);
    payload.phone = _replace(_replace(values.phone, '+7 7', '7'), new RegExp(' ', 'g'), '');
    payload.addressRegistryId = values.arInfo.building.id;
    payload.atsId = values.arInfo.ats.id;
    payload.rca = values.arInfo.building.rca;
    payload.address = values.arInfo.building.shortPathRus;
    payload.userId = this.authModule.id;
    payload.registrationType = this._regType;

    try {
      this._createdRegistrationId = (await api.RegistrationCreate(payload)) as unknown as number;
      notistackExternal.success();
      await this.registrationModule.loadAllRegistrations();
      const registration = await getRegistrationById(this._createdRegistrationId);

      if (registration?.registrationKind === RegistrationKinds.INITIAL) {
        await this.registrationModule.selectRegistration(this._createdRegistrationId);
        return;
      }

      if (registration?.registrationKind === RegistrationKinds.CHANGE_CHAIRMAN) {
        this.openModal(RegistrationKinds.CHANGE_CHAIRMAN);
        return;
      }

      if (registration?.registrationKind === RegistrationKinds.CHANGE_UNION_TYPE) {
        this.openModal(RegistrationKinds.CHANGE_UNION_TYPE);
      }
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  openModal = (modalName: RegistrationModals) => {
    this._openedModals.add(modalName);
  };

  cancelConfirmRegistration = (e: any, reason?: string) => {
    if (reason === 'backdropClick') return;

    this._createdRegistrationId = null;
    this.closeModals();

    this.history.goToCabinet();
  };

  confirmRegistration = async () => {
    try {
      const regId = this.isCreateMode ? this._createdRegistrationId : this.registrationModule.selectedRegistration?.id;

      if (!regId) throw new Error('Не найден Id заявки');

      await confirmCreationRegistration(regId);

      if (this.isCreateMode) {
        await updateWizardStep(regId, this.currentStep);
      }

      await this.registrationModule.loadAllRegistrations();

      this.closeModals();

      await this.registrationModule.selectRegistration(regId);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this._createdRegistrationId = null;
    }
  };

  closeModals = () => {
    this._openedModals.clear();
  };

  isModalOpen = (modalName: RegistrationModals) => this._openedModals.has(modalName);

  prevStep = async (): Promise<void> => {
    try {
      if (this.currentStep - 1 < 0) return;
      // eslint-disable-next-line no-plusplus
      this.currentStep--;

      if (!this.registrationModule.selectedRegistration?.id) return;

      await updateWizardStep(this.registrationModule.selectedRegistration?.id, this.currentStep);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  exit = async () => {
    try {
      if (this._regType === 'FREE') {
        await this.signRegistrationWithoutDocs();

        if (!this.registrationModule.selectedRegistration?.id) throw new Error('regId is undefined');

        await updateWizardStep(this.registrationModule.selectedRegistration?.id, 'finish');
      }
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      await this.registrationModule.loadAllRegistrations();
      this.history.navigateTo(PATH_CABINET.root);
      this.registrationModule.clearSelected();
    }
  };

  onPostSign = async () => {
    try {
      if (this._regType === 'FULL') {
        if (!this.registrationModule.selectedRegistration?.id) throw new Error('regId is undefined');

        await updateWizardStep(this.registrationModule.selectedRegistration?.id, 'finish');
      }
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      await this.registrationModule.loadAllRegistrations();
      this.history.navigateTo(PATH_CABINET.root);
      this.registrationModule.clearSelected();
    }
  };

  signRegistrationWithoutDocs = async () => {
    try {
      if (!this.registrationModule.selectedRegistration?.id) throw new Error('regId is undefined');

      await signWithoutDoc(this.registrationModule.selectedRegistration?.id);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  getSteps = () => {
    if (this._regType === 'FULL') {
      const isNeedAccounts = this.registrationModule.selectedRegistration?.reqDocs.some(
        (reqDoc) => reqDoc.code === ReqDocCodes.CURRENT_IBAN_INFO
      );

      if (!isNeedAccounts) {
        return steps.filter((step) => step.code !== 'accounts');
      }

      return steps;
    }

    return steps.filter((step) => step.code !== 'sign');
  };

  docsUpdated = (idRequiredDocsFilled: boolean) => {
    this._isRequiredDocsFilled = idRequiredDocsFilled;
  };
}
