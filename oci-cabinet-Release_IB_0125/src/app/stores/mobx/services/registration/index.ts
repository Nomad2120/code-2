import { autorun, makeAutoObservable, when } from 'mobx';
import { injectable } from 'inversify';
import { RegistrationModel } from '@mobx/services/registration/model';
import { Registration, RegistrationFullData } from '@mobx/interfaces';
import _ from 'lodash';
import { PATH_CABINET } from '@app/routes/paths';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { ProfileModule } from '@mobx/services/profile';
import { isHydrated, makePersistable } from 'mobx-persist-store';
import { HistoryModule } from '@mobx/services/history';
import { queryClient } from '@shared/api/reactQuery';
import { getGetApiUsersIdRegistrationsQueryOptions } from '@shared/api/orval/users/users';

@injectable()
export class RegistrationModule {
  allRegistrations: Registration[] | null = null;

  selectedRegistration: RegistrationFullData | null = null;

  unionTypes: any;

  status: 'Create' | 'Edit' | undefined;

  // eslint-disable-next-line no-unused-vars
  constructor(private model: RegistrationModel, private profileModule: ProfileModule, private history: HistoryModule) {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'RegistrationModule',
      properties: ['allRegistrations', 'selectedRegistration', 'unionTypes', 'status']
    });

    this.loadUnionTypes();

    autorun(() => {
      if (!this.profileModule.userData.id) return;

      this.loadAllRegistrations();
    });

    when(
      () => Boolean(isHydrated(this) && this.selectedRegistration?.id),
      () => {
        this.refreshRegistration();
      }
    );
  }

  async loadAllRegistrations() {
    try {
      this.allRegistrations = await this.model.getUserRegistrations(this.profileModule.userData.id);
    } catch (e) {
      console.error(e);
      notistackExternal.error('common:getUserRegistrationsError');
    }
  }

  loadUnionTypes = async () => {
    this.unionTypes = await this.model.getUnionTypes();
  };

  selectRegistration = async (id: number | string): Promise<void> => {
    if (!this.allRegistrations || !this.allRegistrations.length) return;

    const registrationData = _.find(this.allRegistrations, (registration: Registration) => registration.id === id);

    if (!registrationData) return;

    const getRegistrationDocs = this.model.getRegistrationDocs(registrationData.id);
    const getRequiredDocs = this.model.getReqDocs(registrationData.id);
    const ar = await this.model.getArInfo(registrationData.addressRegistryId, registrationData.atsId);

    const arInfo = {
      ats: ar.ats,
      geonim: ar.geonim,
      building: Object.entries(ar).reduce((acc, [k, v]) => {
        if (k !== 'ats' && k !== 'geonim') {
          acc[k] = v;
        }
        return acc;
      }, {} as any)
    };

    const data = await Promise.all([getRequiredDocs, getRegistrationDocs]);

    this.selectedRegistration = { ...registrationData, arInfo, reqDocs: data[0], docs: data[1] };

    this.status = 'Edit';

    this.history.navigateTo(PATH_CABINET.registration);
  };

  refreshRegistration = async () => {
    await this.loadAllRegistrations();
    if (!this.selectedRegistration?.id) return;

    await this.selectRegistration(this.selectedRegistration?.id);
  };

  createNewRegistration = () => {
    this.selectedRegistration = null;

    this.status = 'Create';
    this.history.navigateTo(PATH_CABINET.registration, { state: { regType: 'FULL' } });
  };

  continueNotFinishedRegistration = () => {
    const lastReg = this.getRegistrationForContinue();

    if (!lastReg) {
      notistackExternal.error('Не найдено ни одной незавершенной заявки!');
      return;
    }

    this.selectRegistration(lastReg.id);
  };

  createFreeRegistration = () => {
    this.selectedRegistration = null;

    this.status = 'Create';

    this.history.navigateTo(PATH_CABINET.registration, { state: { regType: 'FREE' } });
  };

  clearSelected = () => {
    this.selectedRegistration = null;

    this.status = 'Create';
  };

  getRegistrationForContinue = () => {
    const notFinishedRegistrations = this.allRegistrations?.filter((reg) => {
      if (reg.stateCode === 'PREPARED') return true;

      return reg.stateCode === 'CREATED';
    });

    const lastRegId = notFinishedRegistrations?.sort(
      (a, b) => new Date(b.createDt).getTime() - new Date(a.createDt).getTime()
    )[0];

    return lastRegId;
  };
}
