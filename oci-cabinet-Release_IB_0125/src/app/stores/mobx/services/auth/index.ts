import { makeAutoObservable } from 'mobx';
import { UserData } from '@mobx/interfaces';
import { injectable } from 'inversify';
import { AuthModel } from '@mobx/services/auth/model';
import { makePersistable } from 'mobx-persist-store';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { HistoryModule } from '@mobx/services/history';
import logger from 'js-logger';
import { PATH_AUTH, PATH_HOME } from '@app/routes/paths';

@injectable()
export class AuthModule {
  id: number | null = null;

  userData: UserData | undefined;

  // eslint-disable-next-line no-unused-vars
  constructor(private model: AuthModel, private historyModule: HistoryModule) {
    makeAutoObservable(this);
    makePersistable(this, { name: 'AuthModule', properties: ['id', 'userData'] });
  }

  authUser = async (phone: string, code: string): Promise<void> => {
    try {
      const data = await this.model.authUser(phone, code);
      if (!data.userId) notistackExternal.noAuth();
      this.id = data.userId;
      await this.loadUserData();

      this.historyModule.goToSelectRoles();
    } catch (e) {
      console.error(e);
      notistackExternal.error(e);
    }
  };

  authUserAfterRegistration = async (userId: number): Promise<void> => {
    try {
      this.id = userId;
      await this.loadUserData();

      this.historyModule.goToCabinet();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  sessionExpired = () => {
    this.id = null;
    this.userData = undefined;
    localStorage.setItem('token', '');

    const path = window.location.toString();

    const notRedirectAuthPaths = [PATH_AUTH.login, PATH_AUTH.register];

    const notRedirectLocations = [...notRedirectAuthPaths];
    const isNotRedirectLocation = () => notRedirectLocations.some((allowed) => path.includes(allowed));
    const isHomeLocation = () => window.location.pathname === PATH_HOME.root;

    if (isNotRedirectLocation() || isHomeLocation()) return;

    this.historyModule.goToLogin();
  };

  logout = () => {
    this.id = null;
    this.userData = undefined;
    localStorage.setItem('token', '');

    this.historyModule.goToHome();
  };

  refreshUserInfo = async () => {
    try {
      this.userData = await this.model.getUserData();
    } catch (e: any) {
      logger.error(e);
    }
  };

  private async loadUserData() {
    this.userData = await this.model.getUserData();
  }
}
