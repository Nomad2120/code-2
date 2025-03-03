import { makeAutoObservable } from 'mobx';

export class ServiceNameViewModel {
  isDialogOpen = false;

  customName = '';

  constructor() {
    makeAutoObservable(this);
  }

  closeDialog = () => {
    this.isDialogOpen = false;
    this.customName = '';
  };

  openDialog = () => {
    this.isDialogOpen = true;
    this.customName = '';
    // TODO: clear last values
  };
}
