import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import notistackExternal from '@shared/utils/helpers/notistackExternal';

@injectable()
export class RegistrationDocModel {
  constructor() {
    makeAutoObservable(this);
  }

  downloadDoc = async (doc: any): Promise<void> => {
    try {
      if (doc.extension.toLowerCase() === 'pdf') {
        const fetchData = `data:application/pdf;base64,${doc.base64data}`;
        const a = document.createElement('a');
        a.href = fetchData;
        a.download = doc.fileName;
        a.click();
      } else {
        const image = new Image();
        image.src = `data:image/jpg;base64,${doc.base64data}`;
        const w = window.open('');
        w?.document.write(image.outerHTML);
      }
    } catch (err: any) {
      notistackExternal.error(err.toString());
    }
  };
}
