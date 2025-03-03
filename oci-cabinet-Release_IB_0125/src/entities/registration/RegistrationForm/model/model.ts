import { makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import api from '@app/api';
import { getRegistrationById } from '@shared/api/registration';

export interface RegistrationEditPayload {
  registrationType: 'FREE' | 'FULL';
  apartCount: number;
  email: string | undefined;
  fio: string;
  idn: string;
  name: string;
  unionTypeId: number;
  phone: string;
  addressRegistryId: number;
  atsId: number;
  rca: string;
  address: string;
  userId: number;
  id: number;
}

export interface RegistrationCreatePayload {
  registrationType: 'FREE' | 'FULL';
  apartCount: number;
  email: string | undefined;
  fio: string;
  idn: string;
  name: string;
  unionTypeId: number;
  phone: string;
  addressRegistryId: number;
  atsId: number;
  rca: string;
  address: string;
  userId: number;
}

@injectable()
export class RegistrationFormModel {
  constructor() {
    makeAutoObservable(this);
  }

  createRegistration = async (payload: RegistrationCreatePayload) =>
    (await api.RegistrationCreate(payload)) as unknown as number;

  updateRegistration = (payload: RegistrationEditPayload) => api.RegistrationUpdate(payload.id, payload);

  getRegistrationById = async (regId: number) => getRegistrationById(regId);
}
