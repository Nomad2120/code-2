import { Abonent } from '@shared/types/osi/abonents';

export interface IOsiCreateCorrectionFeatureViewModel {
  isDialogOpen: boolean;
  abonents: Abonent[];
  groups: any;
  user: any;
  openDialog: () => Promise<void>;
  closeDialog: (event?: any, reason?: string) => Promise<void>;
  isLoading: boolean;
  createCorrection: (values: any) => Promise<void>;
  loadGroups: () => Promise<void>;

  onSuccessCb: () => Promise<void>;
}

export const IOsiCreateCorrectionFeatureViewModelToken = Symbol.for('IOsiCreateCorrectionFeatureViewModel');
