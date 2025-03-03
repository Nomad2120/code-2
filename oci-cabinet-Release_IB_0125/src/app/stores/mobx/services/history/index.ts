import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import * as paths from '@app/routes/paths';
import { NavigateOptions } from 'react-router';

// TODO: fix module cycling. after this use router instead of setRouter method
// import { router } from '@app/routes';

const { PATH_AUTH, PATH_OSI, PATH_CABINET } = paths;

@injectable()
export class HistoryModule {
  router: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  setRouter = (router: any) => {
    this.router = router;
  };

  navigateTo = (path: string, options?: NavigateOptions) => {
    this.router.navigate(path, options);
  };

  goToSelectRoles = () => {
    this.navigateTo(PATH_AUTH.selectRole);
  };

  goToLogin = () => {
    this.navigateTo(PATH_AUTH.login);
  };

  goToHome = () => {
    this.navigateTo('/');
  };

  goToCabinet = () => {
    this.navigateTo(PATH_CABINET.root);
  };

  goToOsiRoot = () => {
    this.navigateTo(PATH_OSI.root);
  };

  goToWizard = () => {
    this.navigateTo(PATH_OSI.wizard);
  };
}
