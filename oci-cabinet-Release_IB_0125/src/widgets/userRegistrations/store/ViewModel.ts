import { autorun, makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { IUserRegistrationsViewModel } from '@shared/types/mobx/widgets/UserRegistrations';
import { queryClient } from '@shared/api/reactQuery';
import {
  getGetApiUsersIdRegistrationsQueryKey,
  getGetApiUsersIdRegistrationsQueryOptions
} from '@shared/api/orval/users/users';
import { ProfileModule } from '@mobx/services/profile';
import { DbRegistration } from '@shared/api/orval/models';
import { GridSortModel } from '@mui/x-data-grid';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';
import { HistoryModule } from '@mobx/services/history';
import { PATH_CABINET } from '@app/routes/paths';

@injectable()
export class UserRegistrationViewModel implements IUserRegistrationsViewModel {
  private _queryCache = queryClient.getQueryCache();

  constructor(private _profileModule: ProfileModule, private _history: HistoryModule) {
    makeAutoObservable(this);

    autorun(async () => {
      // await this.loadUserRegistrations();
    });

    this._queryCache.subscribe(({ query }) => {
      const queryKey = getGetApiUsersIdRegistrationsQueryKey(this._profileModule.userData.id);
      if (query.queryKey[0] === queryKey[0]) {
        if (!query.state.data?.result) return;

        this._registrations = query.state.data.result;
      }
    });
  }

  private _sortModel: GridSortModel = [
    {
      field: 'createDt',
      sort: 'desc'
    }
  ];

  get sortModel(): GridSortModel {
    return this._sortModel;
  }

  set sortModel(value: GridSortModel) {
    this._sortModel = value;
  }

  private _registrations: DbRegistration[] = [];

  get registrations(): DbRegistration[] {
    return this._registrations;
  }

  selectRegistration = (registration: DbRegistration) => {
    const { stateCode } = registration;
    if (!['CREATED', 'PREPARED'].includes(stateCode)) return;

    this._history.router.navigate(PATH_CABINET.registration, { state: { registrationId: registration.id } });
  };

  private loadUserRegistrations = async () => {
    try {
      // TODO: без timeout получаю ошибку cancelled error разобраться почему
      setTimeout(async () => {
        const response = await queryClient.fetchQuery(
          getGetApiUsersIdRegistrationsQueryOptions(this._profileModule.userData.id)
        );
        if (!response.result) return;

        this._registrations = response.result;
      }, 0);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };
}
