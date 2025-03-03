import { autorun, makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { OsiData } from '@mobx/interfaces';
import { applyFilter } from '@widgets/osiList/utils';
import { ProfileModule } from '@/app/stores/mobx/services/profile';

@injectable()
export class OsiListViewModel {
  filter = '';

  osis: OsiData[] = [];

  constructor(private profileModule: ProfileModule) {
    makeAutoObservable(this);

    autorun(() => {
      this.osis = this.profileModule.userData.osis;
    });
  }

  getOsis = () => applyFilter(this.osis, this.filter);

  changeFilter(value: string) {
    this.filter = value;
  }
}
