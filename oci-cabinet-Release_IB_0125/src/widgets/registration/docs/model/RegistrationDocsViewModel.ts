import { autorun, makeAutoObservable } from 'mobx';
import { RegistrationDocsModel } from '@widgets/registration/docs/model/registrationDocsModel';
import { getBase64, resizeFile } from '@shared/utils/helpers/base64Convertion';
import _ from 'lodash';
import pdfIcon from '@shared/icons/pdf100.png';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { injectable } from 'inversify';
import { RegistrationModule } from '@mobx/services/registration';
import { RegistrationDoc } from '@mobx/interfaces';

@injectable()
export class RegistrationDocsViewModel {
  docsList: Array<any> = [];

  localFiles: Array<any> = [];

  uploadedFiles: Array<any> = [];

  registrationData: any;

  isDocsLoading = false;

  deleteProgress = 0;

  deleteInterval: any;

  deletingDoc: any;

  constructor(private model: RegistrationDocsModel, private registrationModule: RegistrationModule) {
    makeAutoObservable(this);

    autorun(() => {
      const docs = this.registrationModule.selectedRegistration?.docs.filter(
        (doc) => (doc.docTypeCode as any) === 'SPR_REG_OSI'
      );

      this.reset();

      if (!docs) return;

      this.prepareUploadedFiles(docs);
    });
  }

  get isHasDocs(): boolean {
    if (this.docsList.length > 0) return true;

    return false;
  }

  reset = () => {
    this.docsList = [];
    this.localFiles = [];
    this.uploadedFiles = [];
    this.registrationData = null;
    this.deleteProgress = 0;
    this.deletingDoc = null;
  };

  onDropFiles = async (files: Array<any>): Promise<void> => {
    try {
      this.setLoading(true);

      const regId = this.registrationModule.selectedRegistration?.id;

      if (!regId) return;

      await Promise.all(
        files.map(async (file: File) => {
          let data;
          let base64data;
          if (file.name.split('.').pop()?.toLowerCase() === 'pdf') {
            data = await getBase64(file);
            base64data = data.base64StringFile;
          } else {
            data = await resizeFile(file);
            base64data = data.substring(data.indexOf(',') + 1);
          }

          const payload = {
            docTypeCode: 'SPR_REG_OSI',
            data: base64data,
            extension: file.name.split('.').pop()
          };
          await this.model.saveDoc(regId, payload);

          // const doc = this.createDocFromFile(file, base64data, true);

          // this.docsList.push(doc);
        })
      );
    } catch (e: any) {
      console.error(e.toString());
      notistackExternal.error(e.toString());
    } finally {
      await this.registrationModule.refreshRegistration();
      this.setLoading(false);
    }
  };

  deleteDoc = async (doc: any): Promise<void> => {
    this.setLoading(true);
    try {
      if (!doc.isLocal && this.registrationModule.selectedRegistration?.id) {
        await this.model.deleteDoc(this.registrationModule.selectedRegistration.id, doc.id);
      }
      _.remove(this.docsList, (item) => item === doc);
      await this.registrationModule.refreshRegistration();
    } catch (e: any) {
      console.error(e.toString());
      notistackExternal.error(e.toString());
    } finally {
      this.setLoading(false);
    }
  };

  saveDocs = async (): Promise<void> => {
    this.setLoading(true);
    try {
      const localDocs = this.docsList.filter((doc: any) => doc.isLocal);
      const regId = this.registrationModule.selectedRegistration?.id;

      if (!regId) return;

      await Promise.all(
        localDocs.map(async (localDoc: any) => {
          const payload = {
            docTypeCode: 'SPR_REG_OSI',
            data: localDoc.base64data,
            extension: localDoc.extension
          };
          await this.model.saveDoc(regId, payload);
          const localDocIndex = this.docsList.findIndex((doc: any) => doc.fileName === localDoc.fileName);
          this.docsList[localDocIndex].isLocal = false;
        })
      );

      await this.registrationModule.refreshRegistration();
    } catch (e: any) {
      console.error(e.toString());
      notistackExternal.error(e.toString());
    } finally {
      this.setLoading(false);
    }
  };

  private async prepareUploadedFiles(docs: RegistrationDoc[] | undefined) {
    this.uploadedFiles = await this.model.prepareUploadedFiles(docs);
    this.uploadedFiles.forEach((uploadedFile) => {
      const document = {
        ...uploadedFile,
        extension: uploadedFile?.file?.name?.split('.')?.pop()
      };
      this.docsList.push(document);
    });
    this.docsList = _.uniqBy(this.docsList, 'id');
  }

  private createDocFromFile(file: File, base64data: any, isLocal: boolean, docId = null) {
    const doc = {
      file,
      preview: this.createPreview(file),
      base64data,
      extension: file.name.split('.').pop(),
      fileName: file.name,
      isLocal,
      docId
    };
    return doc;
  }

  private setLoading(state: boolean) {
    this.isDocsLoading = state;
  }

  private createPreview(file: File) {
    if (file.name.split('.').pop()?.toLocaleLowerCase() === 'pdf') {
      return pdfIcon;
    }
    return URL.createObjectURL(file);
  }
}
