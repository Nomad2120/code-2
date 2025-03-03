import { makeAutoObservable } from 'mobx';
import { IOsiServiceSaldoTableViewModel } from '@shared/types/mobx/entities/osiServiceSaldo';
import { injectable } from 'inversify';

@injectable()
export class OsiServiceSaldoTableViewModel implements IOsiServiceSaldoTableViewModel {
  saveSaldo: any;

  constructor() {
    makeAutoObservable(this);
  }
}
