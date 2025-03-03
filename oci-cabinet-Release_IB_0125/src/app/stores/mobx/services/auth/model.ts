import { makeAutoObservable } from 'mobx';
import { AuthData, UserData } from '@mobx/interfaces';
import api from '@app/api';
import { injectable } from 'inversify';

@injectable()
export class AuthModel {
  constructor() {
    makeAutoObservable(this);
  }

  authUser = async (phone: string, code: string): Promise<AuthData> =>
    (await api.Auth(phone, code)) as unknown as AuthData;

  getUserData = async (): Promise<UserData> => (await api.UsersGetInfo()) as unknown as UserData;
}
