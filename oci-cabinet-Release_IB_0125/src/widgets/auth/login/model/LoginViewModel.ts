import { makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { AuthModule } from '@/app/stores/mobx/services/auth';

@injectable()
export class LoginViewModel {
  constructor(private authModule: AuthModule) {
    makeAutoObservable(this);
  }

  authUser = async (phone: string, code: string) => {
    await this.authModule.authUser(phone, code);
  };
}
