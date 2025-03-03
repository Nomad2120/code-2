import { makeAutoObservable } from 'mobx';
import { OsiModule } from '@mobx/services/osiModule';
import { Act } from '@shared/types/osi/acts';
import {
  getBase64ByScanId,
  getDocsByActId,
  getNotSignedActsByOsiId,
  getSignedActsByOsiId,
  getWorkCompletionAct
} from '@shared/api/osiActs';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { injectable } from 'inversify';
import { downloadBase64Pdf, openBase64PdfInNewWindow } from '@shared/utils/helpers/pdfHelpers';
import api from '@app/api';

interface SignedActsDialog {
  doc: {
    fileName: string;
    base64: string;
  } | null;
  isOpen: boolean;
  act: Act | null;
}

const initialSignedActsDialog: SignedActsDialog = {
  doc: null,
  isOpen: false,
  act: null
};

interface NotSignedActsDialog {
  doc: {
    fileName: string;
    base64: string;
  } | null;
  isOpen: boolean;
  act: Act | null;
}

const initialNotSignedActsDialog: NotSignedActsDialog = {
  doc: null,
  isOpen: false,
  act: null
};

@injectable()
export class OsiActsWidgetViewModel {
  isLoading = false;

  signedActs: Act[] = [];

  notSignedActs: Act[] = [];

  signedActsDialog: SignedActsDialog = initialSignedActsDialog;

  notSignedActsDialog: NotSignedActsDialog = initialNotSignedActsDialog;

  constructor(private osiModule: OsiModule) {
    makeAutoObservable(this);

    void this.loadSignedActs();
    void this.loadNotSignedActs();
  }

  get osiAddress(): string {
    return this.osiModule.osiInfo?.address || '';
  }

  loadSignedActs = async () => {
    try {
      this.isLoading = true;
      if (!this.osiModule.osiInfo?.id) return;

      const signedActs = await getSignedActsByOsiId(this.osiModule.osiInfo.id);
      this.signedActs = signedActs;
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  loadNotSignedActs = async () => {
    try {
      this.isLoading = true;
      if (!this.osiModule.osiInfo?.id) return;

      const notSignedActs = await getNotSignedActsByOsiId(this.osiModule.osiInfo.id);
      this.notSignedActs = notSignedActs;
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  onShowSignedActClick = async (actId: number): Promise<void> => {
    // TODO: add loading state to all buttons
    try {
      const act = this.signedActs?.find((act) => act.id === actId);

      if (!act) throw new Error('Акт не найден');

      const docs = await getDocsByActId(actId);
      if (!docs.length || !docs[0]?.scan?.id) throw new Error('Не удалось получить скан');

      const base64 = await getBase64ByScanId(docs[0].scan.id);

      this.signedActsDialog.doc = {
        fileName: docs[0].scan?.fileName,
        base64
      };
      this.signedActsDialog.act = act;
      this.signedActsDialog.isOpen = true;
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  onCloseSignedActsDialog = () => {
    this.signedActsDialog = initialSignedActsDialog;
  };

  onPrintAct = () => {
    if (!this.signedActsDialog.doc?.base64) return;

    openBase64PdfInNewWindow(this.signedActsDialog.doc.base64);
  };

  onDownloadAct = () => {
    if (!this.signedActsDialog.doc?.base64) return;

    downloadBase64Pdf(this.signedActsDialog.doc.base64, this.signedActsDialog.doc.fileName);
  };

  onSignActClick = async (actId: number): Promise<void> => {
    try {
      const act = this.notSignedActs?.find((act) => act.id === actId);

      if (!act) throw new Error('Не найден акт');

      const data = await getWorkCompletionAct(act.id);
      if (!data) throw new Error('Не удалось получить данные акта');

      const base64 = data.pdfBase64;

      this.notSignedActsDialog.doc = {
        fileName: '',
        base64
      };

      this.notSignedActsDialog.act = act;
      this.notSignedActsDialog.isOpen = true;
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  onPostSign = async (data: string): Promise<void> => {
    try {
      if (!this.notSignedActsDialog.act?.id) throw new Error('Не найден акт');

      await api.saveSignedWorkCompletionAct(this.notSignedActsDialog.act.id, data);

      await this.osiModule.refreshOsi();
      await Promise.allSettled([this.loadNotSignedActs(), this.loadSignedActs()]);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.onCloseNotSignedActsDialog();
    }
  };

  onCloseNotSignedActsDialog = () => {
    this.notSignedActsDialog = initialNotSignedActsDialog;
  };
}
