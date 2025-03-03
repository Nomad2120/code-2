import {
  OsiAccountApplication,
  OsiAccountApplicationDoc,
  OsiAccountApplicationDocFile
} from '@shared/types/osiAccountApplications';

export interface OsiApplicationInfoModal {
  isOpen: boolean;
  application: OsiAccountApplication | null;
  docs: OsiAccountApplicationDoc[];
  file: OsiAccountApplicationDocFile | null;
}

export interface IOsiAccountApplicationsWidgetViewModel {
  applications: OsiAccountApplication[];
  infoModal: OsiApplicationInfoModal;
  showApplicationInfo: (application: OsiAccountApplication) => Promise<void>;
  closeApplicationInfo: () => void;
  attachDocument: (file: File) => Promise<void>;
  isSelectedApplicationHasDocs: boolean;
  refreshApplications: () => Promise<void>;
}

export const IOsiAccountApplicationsWidgetViewModelToken = Symbol.for('IOsiAccountApplicationsWidgetViewModel');
