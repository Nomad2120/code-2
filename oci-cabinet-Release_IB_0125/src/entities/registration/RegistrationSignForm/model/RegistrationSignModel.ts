import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import api from '@app/api';

export interface ContractInfo {
  id: number;
  address: string;
  apartCount: number;
  createDt: Date;
  email: string;
  idn: string;
  name: string;
  phone: string;
  fio: string;
  tariff: number;
}

@injectable()
export class RegistrationSignModel {
  constructor() {
    makeAutoObservable(this);
  }

  createContract = async (payload: ContractInfo) => api.createContract(payload);

  signContract = async (regId: number, payload: any) => api.signContract(regId, payload);
}
