import { makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { DeleteAccountButtonViewModelInterface } from '@shared/types/mobx/features/osiAccounts';

@injectable()
export class DeleteAccountButtonFeature implements DeleteAccountButtonViewModelInterface {
  isConfirmDialogOpen = false;

  constructor() {
    makeAutoObservable(this);
  }
}
