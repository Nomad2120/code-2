import { injectable } from 'inversify';
import { autorun, makeAutoObservable } from 'mobx';
import { ProfileModule } from '@mobx/services/profile';
import { AuthModule } from '@mobx/services/auth';

@injectable()
export class CabinetAccountViewModel {
  userInfo: any = null;

  isOpen;

  // eslint-disable-next-line no-unused-vars
  constructor(private profileModule: ProfileModule, private authModule: AuthModule) {
    makeAutoObservable(this);

    this.isOpen = false;
    this.userInfo = this.profileModule.userData.info;
    autorun(() => {
      this.userInfo = this.profileModule.userData.info;
    });
  }

  open = () => {
    this.isOpen = true;
  };

  close = () => {
    this.isOpen = false;
  };

  logout = () => {
    this.authModule.logout();
    this.close();
  };
}
