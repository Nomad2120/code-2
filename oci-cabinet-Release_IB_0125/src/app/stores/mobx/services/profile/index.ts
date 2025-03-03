import { autorun, makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { ProfileModel } from '@mobx/services/profile/model';
import { AppartmentParsedData, User } from '@mobx/interfaces';
import { RolesModule } from '@mobx/services/roles';
import { makePersistable } from 'mobx-persist-store';
import { omit } from 'lodash';
import logger from 'js-logger';
import { AuthModule } from '../auth';
import { initialUser } from '../../initial';

@injectable()
export class ProfileModule {
  userData: User = initialUser;

  // eslint-disable-next-line no-unused-vars
  constructor(private model: ProfileModel, private authModule: AuthModule, private rolesModule: RolesModule) {
    makeAutoObservable(this);
    makePersistable(this, { name: 'ProfileModule', properties: ['userData'] });

    autorun(() => {
      if (!this.authModule.userData?.id) {
        return;
      }
      this.userData.id = this.authModule.userData?.id;
    });

    autorun(() => {
      this.userData.info = this.authModule.userData;
    });

    autorun(() => {
      if (!this.rolesModule.currentRole) return;

      this.userData.currentRole = this.rolesModule.currentRole;

      switch (this.userData.currentRole.role) {
        case 'CHAIRMAN': {
          this.loadChairmanData();
          break;
        }
        case 'ABONENT': {
          this.loadAbonentData();
          break;
        }
        case 'OPERATOR': {
          this.loadChairmanData();
          this.loadAbonentData();
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  refreshUserInfo = async () => {
    try {
      await this.authModule.refreshUserInfo();
    } catch (e: any) {
      logger.error(e);
    }
  };

  private async loadChairmanData() {
    if (!this.authModule.id) return;

    this.userData.osis = (await this.model.getUserOsi(this.authModule.id)).sort((a, b) => a.id - b.id);
  }

  private async loadAbonentData() {
    if (!this.authModule.id) return;

    const appartments = (await this.model.getUserApartment(this.userData.id)).sort((a, b) => a.osiId - b.osiId);

    if (Array.isArray(appartments)) {
      const list: AppartmentParsedData[] = [];
      appartments.forEach((a) => {
        const { abonents = [] } = a;
        abonents.forEach((b) => {
          list.push(omit({ ...b, ...a }, ['abonents']));
        });
      });
      this.userData.appartments = list;
    } else this.userData.appartments = [];
  }
}
