import { OsiServiceCompany, OsiServiceCompanyForm } from '@shared/types/osi/osiServiceCompanies';
import { ServiceCompany } from '@shared/types/dictionaries';

export interface AddOsiServiceCompanyButtonViewModelInterface {
  isDialogOpen: boolean;
  setForm: (hookForm: any) => void;
  defaultValues: OsiServiceCompanyForm;
  onCloseDialogClick: () => void;
  onSaveDialogClick: () => void;
  onOpenDialogClick: () => void;
  reloadServices: () => void;
  setReloadServices: (reloadServices: () => void) => void;
  serviceCompanyTypes: ServiceCompany[];
}

export const addOsiServiceCompanyButtonViewModelToken = Symbol.for('AddOsiServiceCompanyButtonViewModelInterface');

export interface EditOsiServiceCompanyButtonViewModelInterface {
  isDialogOpen: boolean;
  setForm: (hookForm: any) => void;
  defaultValues: OsiServiceCompanyForm;
  onCloseDialogClick: () => void;
  onSaveDialogClick: () => void;
  onEditClick: (company: OsiServiceCompany) => void;
  reloadServices: () => void;
  setReloadServices: (reloadServices: () => void) => void;
  serviceCompanyTypes: ServiceCompany[];
}

export const editOsiServiceCompanyButtonViewModelToken = Symbol.for('EditOsiServiceCompanyButtonViewModelInterface');

export interface DeleteOsiServiceCompanyButtonViewModelInterface {
  onConfirmDeleteClick: (company: OsiServiceCompany) => void;
  reloadServices: () => void;
  setReloadServices: (reloadServices: () => void) => void;
}

export const deleteOsiServiceCompanyButtonViewModelToken = Symbol.for(
  'DeleteOsiServiceCompanyButtonViewModelInterface'
);

export interface IPrintServiceCheckboxFeatureViewModel {
  isChecked: boolean;
  serviceCompany: OsiServiceCompany;
  onClick: (e: any) => Promise<void>;
}

export const IPrintServiceCheckboxFeatureViewModelToken = Symbol.for('IPrintServiceCheckboxFeatureViewModel');
