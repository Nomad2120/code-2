export interface IAccuralDateViewModel {
  hookForm: any;
  allowedDates: string[];
  updatePlanDate: () => Promise<void>;
  accuralJobDay: string;
  isModalOpen: boolean;
  closeModal: () => void;
  openModal: () => void;
  onDateChanged: () => void;
  cancelChangeDate: () => void;
}

export const IAccuralDateViewModelToken = Symbol.for('IAccuralDateViewModel');
