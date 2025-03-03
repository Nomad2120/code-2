import { makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import api from '@app/api';
import { AppartmentData, OsiData } from '@mobx/interfaces';

@injectable()
export class ProfileModel {
  constructor() {
    makeAutoObservable(this);
  }

  getUserOsi = async (userId: number): Promise<OsiData[]> => (await api.UsersOsis(userId)) as unknown as OsiData[];

  getUserApartment = async (userId: number): Promise<AppartmentData[]> =>
    (await api.UsersAppartments(userId)) as unknown as AppartmentData[];
}
