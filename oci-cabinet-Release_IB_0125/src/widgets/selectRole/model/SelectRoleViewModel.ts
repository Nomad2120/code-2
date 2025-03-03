import { autorun, makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { SUPPORTED_USER_ROLES } from '@shared/constants/SupportedUserRoles';
import { UserRole } from '@mobx/interfaces';
import { RolesModule } from '@mobx/services/roles';

@injectable()
export class SelectRoleViewModel {
  roles: UserRole[] | undefined;

  constructor(private rolesModule: RolesModule) {
    makeAutoObservable(this);

    autorun(() => {
      if (!this.rolesModule.roles.length) return;

      this.roles = rolesModule.roles.filter((r) => SUPPORTED_USER_ROLES.includes(r.role));
    });
  }

  selectRole = (role: UserRole) => {
    this.rolesModule.selectRole(role);
  };
}
