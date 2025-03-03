import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { RegistrationDocsViewModel } from '@widgets/registration/docs/model/RegistrationDocsViewModel';
import { RegistrationDocModel } from './RegistrationDocModel';

@injectable()
export class RegistrationDocViewModel {
  doc = null as any;

  deleteProgress = 0;

  isDeletingProcess = false;

  deleteInterval = null as any;

  constructor(private model: RegistrationDocModel, private registrationDocsViewModel: RegistrationDocsViewModel) {
    makeAutoObservable(this);
  }

  setDoc(doc: any) {
    this.doc = doc;
  }

  startDeleteProcess = () => {
    this.isDeletingProcess = true;
    this.deleteInterval = setInterval(async () => {
      this.deleteProgress += 10;
      if (this.deleteProgress === 100) {
        await this.registrationDocsViewModel.deleteDoc(this.doc);
      }
    }, 100);
  };

  resetDeleteProcess = () => {
    clearInterval(this.deleteInterval);
    this.deleteProgress = 0;
    this.isDeletingProcess = false;
  };

  downloadDoc = async (): Promise<void> => {
    await this.model.downloadDoc(this.doc);
  };
}
