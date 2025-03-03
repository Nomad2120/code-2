import { autorun, makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { IRegistrationDocumentsViewModel } from '@shared/types/mobx/widgets/RegistrationDocuments';
import { getDocsByRegistrationId } from '@shared/api/registration';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';
import { DocScan, DocTypeCodes, RegistrationDocFile, RequiredDocsResponse } from '@shared/types/registration';
import { RegistrationModule } from '@mobx/services/registration';
import _ from 'lodash';
import api from '@app/api';
import { fromDocToFile } from '@shared/utils/files';

@injectable()
export class RegistrationDocumentsViewModel implements IRegistrationDocumentsViewModel {
  reqdocs: RequiredDocsResponse[] = [];

  docs: RegistrationDocFile[] = [];

  isLoading = false;

  // eslint-disable-next-line no-unused-vars
  constructor(private registrationModule: RegistrationModule) {
    makeAutoObservable(this);
    void this.loadDocs();

    autorun(() => {
      this.reqdocs = this.registrationModule.selectedRegistration?.reqDocs || [];
    });
  }

  get isRequiredDocsFilled(): boolean {
    const requiredDocTypes = this.reqdocs.filter((doc) => doc.isRequired).map((doc) => doc.code);
    const loadedDocTypes = this.docs.map((doc) => doc.docTypeCode);

    if (!requiredDocTypes.length || !loadedDocTypes.length) return false;

    return requiredDocTypes.every((reqDoc) => loadedDocTypes.includes(<DocTypeCodes>reqDoc));
  }

  get regId() {
    return this.registrationModule.selectedRegistration?.id;
  }

  get regUnionTypeId(): number | undefined {
    return this.registrationModule.selectedRegistration?.unionTypeId;
  }

  loadDocs = async () => {
    try {
      if (
        this.registrationModule.selectedRegistration?.id === null ||
        this.registrationModule.selectedRegistration?.id === undefined
      ) {
        return;
      }

      this.isLoading = true;

      const docs = await getDocsByRegistrationId(this.registrationModule.selectedRegistration.id);

      // @ts-expect-error документы не типизированы
      this.docs = await Promise.all(docs.map(async (doc) => fromDocToFile(doc)));
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  deleteDoc = async (doc: RegistrationDocFile): Promise<void> => {
    try {
      this.isLoading = true;
      if (this.registrationModule.selectedRegistration?.id) {
        await api.RegistrationDeleteDoc(this.registrationModule.selectedRegistration.id, doc.id);
      }
      _.remove(this.docs, (item) => item === doc);
      await this.registrationModule.refreshRegistration();
    } catch (e: unknown) {
      if (typeof e === 'string') {
        console.error(e.toString());
        notistackExternal.error(e);
        return;
      }
      if (e instanceof Error) {
        console.error(e.message);
        notistackExternal.error(e.message);
      }
    } finally {
      this.isLoading = false;
    }
  };

  uploadDoc = async (scan: DocScan) => {
    try {
      if (
        this.registrationModule.selectedRegistration?.id === null ||
        this.registrationModule.selectedRegistration?.id === undefined
      ) {
        return;
      }

      this.isLoading = true;
      await api.RegistrationUpdateDoc(this.registrationModule.selectedRegistration?.id, scan);
      await this.registrationModule.refreshRegistration();
      await this.loadDocs();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };
}
