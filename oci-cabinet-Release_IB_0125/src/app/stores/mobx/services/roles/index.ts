import { autorun, makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { UserRole, UserRoles } from '@mobx/interfaces';
import { makePersistable } from 'mobx-persist-store';
import { AuthModule } from '@mobx/services/auth';
import { PATH_CABINET } from '@app/routes/paths';
import { HistoryModule } from '@mobx/services/history';

@injectable()
export class RolesModule {
  roles: UserRole[] = [];

  currentRole: UserRole | null = null;

  constructor(private authModule: AuthModule, private history: HistoryModule) {
    makeAutoObservable(this);
    makePersistable(this, { name: 'RolesModule', properties: ['roles', 'currentRole'] });

    autorun(() => {
      this.roles = this.authModule.userData?.roles ?? [];
    });
  }

  get isHasAdminRole() {
    return !!this.roles.find((role) => role.role === 'ADMIN');
  }

  get isHasOperatorRole() {
    return !!this.roles.find((role) => role.role === 'OPERATOR');
  }

  selectRole(role: UserRole) {
    this.currentRole = role;

    this.history.navigateTo(PATH_CABINET.root);
  }
}
