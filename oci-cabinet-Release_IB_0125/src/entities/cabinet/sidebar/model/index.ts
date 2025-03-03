import { autorun, makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { UserRole } from '@mobx/interfaces';
import { RolesModule } from '@mobx/services/roles';
import { ProfileModule } from '@mobx/services/profile';

@injectable()
export class CabinetSidebarViewModel {
  isOpen: boolean;

  currentRole: UserRole | null;

  roles: UserRole[] | null;

  userInfo: any | null;

  constructor(private rolesModule: RolesModule, private profileModule: ProfileModule) {
    makeAutoObservable(this);

    this.isOpen = false;

    this.currentRole = this.rolesModule.currentRole;
    this.roles = this.rolesModule.roles;

    this.userInfo = this.profileModule.userData.info;

    autorun(() => {
      this.currentRole = this.rolesModule.currentRole;
    });

    autorun(() => {
      this.roles = this.rolesModule.roles;
    });

    autorun(() => {
      this.userInfo = this.profileModule.userData.info;
    });
  }
}
