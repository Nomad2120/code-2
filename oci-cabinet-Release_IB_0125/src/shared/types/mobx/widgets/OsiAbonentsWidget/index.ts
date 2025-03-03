import { Abonent } from '@shared/types/osi/abonents';
import { AreaType } from '@shared/types/dictionaries';

export interface IOsiAbonentsWidgetViewModel {
  abonents: Abonent[];
  sortedAbonents: Abonent[];
  isLoading: boolean;
  downloadReport: () => Promise<void>;
  isCreatingDialogOpen: boolean;
  startCreatingAbonent: () => void;
  stopCreatingAbonent: () => void;
  isEditingDialogOpen: boolean;
  startEditingAbonent: (abonent: Abonent) => void;
  stopEditingAbonent: () => void;

  reloadCb: any;

  totalAbonents: number;
  totalSquare: string;
  totalParkingPlaces: number;

  osiId: number | null;
  areaTypes: AreaType[];
  cancelCreating: () => void;
  addAbonent: () => string;
  updateAbonent: (abonent: Abonent) => void;
  saveTemporaryRow: (tempRow: any) => void;
  clearTemporaryRow: () => void;
  importAbonents: (file: File) => Promise<void>;
}

export const IOsiAbonentsWidgetViewModelToken = Symbol.for('IOsiAbonentsWidgetViewModel');
