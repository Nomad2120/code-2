import { makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { OsiModule } from '@mobx/services/osiModule';

@injectable()
export class OsiActsPageViewModel {
  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);
  }

  get pageTitle(): string | undefined {
    return this.osiModule?.osiInfo?.name || 'Кабинет ОСИ';
  }
}
