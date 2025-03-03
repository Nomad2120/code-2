import { GridSortModel } from '@mui/x-data-grid';
import { OSICoreModelsDbRegistration } from '@shared/api/orval/models';

export interface IUserRegistrationsViewModel {
  sortModel: GridSortModel;
  selectRegistration: (registration: OSICoreModelsDbRegistration) => void;
  registrations: OSICoreModelsDbRegistration[];
}

export const token = Symbol.for('IUserRegistrationsViewModel');
