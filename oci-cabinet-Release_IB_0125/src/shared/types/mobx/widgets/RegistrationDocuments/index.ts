import { DocScan, RegistrationDocFile, RequiredDocsResponse } from '@shared/types/registration';

export interface IRegistrationDocumentsViewModel {
  reqdocs: RequiredDocsResponse[];
  regId: number | undefined;
  docs: RegistrationDocFile[];
  deleteDoc: (doc: RegistrationDocFile) => Promise<void>;
  uploadDoc: (scan: DocScan) => Promise<void>;
  isRequiredDocsFilled: boolean;
  regUnionTypeId: number | undefined;
  isLoading: boolean;
}

export const RegistrationDocumentsViewModelToken = Symbol.for('RegistrationDocumentsViewModel');
