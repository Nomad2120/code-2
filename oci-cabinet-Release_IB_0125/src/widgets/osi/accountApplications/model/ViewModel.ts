import {
  IOsiAccountApplicationsWidgetViewModel,
  OsiApplicationInfoModal
} from '@shared/types/mobx/widgets/OsiAccountApplications';
import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { OsiAccountApplication, OsiAccountApplicationDocFile } from '@shared/types/osiAccountApplications';
import { getAccountApplications } from '@shared/api/osi';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { OsiModule } from '@mobx/services/osiModule';
import { fileToScanDoc, fromDocToFile } from '@shared/utils/files';
import { attachDocToOsiAccountApplication, getOsiAccountApplicationDocsById } from '@shared/api/osiAccountApplications';
import { DocTypeCodes } from '@shared/types/registration';
import { OsiAccountTypes } from '@shared/types/osi/accounts';

@injectable()
export class OsiAccountApplicationsWidgetViewModel implements IOsiAccountApplicationsWidgetViewModel {
  applications: OsiAccountApplication[] = [];

  infoModal: OsiApplicationInfoModal = {
    isOpen: false,
    application: null,
    docs: [],
    file: null
  };

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);

    this.loadApplications();
  }

  get isSelectedApplicationHasDocs(): boolean {
    return this.infoModal.docs.length > 0;
  }

  loadApplications = async () => {
    try {
      if (!this.osiModule?.osiInfo?.id) return;

      this.applications = await getAccountApplications(this.osiModule.osiInfo.id);
    } catch (e) {
      logger.error(e);
      notistackExternal.error(e);
    }
  };

  showApplicationInfo = async (application: OsiAccountApplication) => {
    try {
      if (!application.id) throw new Error('Не найден Id заявки');

      const docs = await getOsiAccountApplicationDocsById(application.id);

      if (docs.length > 0) {
        const file = (await fromDocToFile(docs[0])) as OsiAccountApplicationDocFile;
        this.infoModal.file = file;
      }

      this.infoModal.docs = docs;
      this.infoModal.application = application;
      this.infoModal.isOpen = true;
    } catch (e) {
      logger.error(e);
      notistackExternal.error(e);
    }
  };

  closeApplicationInfo = () => {
    this.infoModal.isOpen = false;
    this.infoModal.application = null;
  };

  attachDocument = async (file: File) => {
    try {
      if (!this.infoModal.application?.id) throw new Error('Не найден Id заявки');

      const docTypeCode =
        this.infoModal.application?.type === OsiAccountTypes.CURRENT
          ? DocTypeCodes.CURRENT_IBAN_INFO
          : DocTypeCodes.SAVING_IBAN_INFO;

      const fileToBackend = await fileToScanDoc(file, docTypeCode);

      await attachDocToOsiAccountApplication(this.infoModal.application.id, fileToBackend);

      await this.refreshApplications();

      this.closeApplicationInfo();
      notistackExternal.success();
    } catch (e) {
      logger.error(e);
      notistackExternal.error(e);
    }
  };

  refreshApplications = async () => {
    try {
      await this.loadApplications();
    } catch (e) {
      logger.error(e);
      notistackExternal.error('common:refreshApplicationsError');
    }
  };
}
