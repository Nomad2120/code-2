import { IAccountChangePasswordWidgetViewModel } from '@shared/types/mobx/widgets/AccountChangePassword';
import { makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import logger from 'js-logger';
import api from '@app/api';
import { ProfileModule } from '@mobx/services/profile';

@injectable()
export class AccountChangePasswordWidgetViewModel implements IAccountChangePasswordWidgetViewModel {
  isLoading = false;

  constructor(private profileModule: ProfileModule) {
    makeAutoObservable(this);
  }

  changePassword = async (values: any) => {
    try {
      if (!this.profileModule.userData.id) throw new Error('userId is undefined');
      this.isLoading = true;

      const oldPassword = Object.keys(values)
        .filter((x) => x.substr(0, 11) === 'oldPassword')
        .reduce((str, item) => (str += values[item]), '');
      const newPassword = Object.keys(values)
        .filter((x) => x.substr(0, 11) === 'newPassword')
        .reduce((str, item) => (str += values[item]), '');
      const confirmPassword = Object.keys(values)
        .filter((x) => x.substr(0, 15) === 'confirmPassword')
        .reduce((str, item) => (str += values[item]), '');

      const payload = {
        oldPassword,
        newPassword,
        confirmPassword
      };

      await api.UsersChangePassword(this.profileModule.userData.id, payload);
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      this.isLoading = false;
    }
  };
}
