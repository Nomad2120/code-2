import { mockHouseStateCode } from '@shared/constants/houseStateCode';

import { OsiInfoValues } from '@shared/types/osi';

export const initialFormValues: OsiInfoValues = {
  name: '',
  fio: '',
  idn: '',
  phone: '',
  email: '',
  houseStateCode: mockHouseStateCode,
  floors: '',
  wreckage: false,
  personalHeating: false,
  personalHotWater: false,
  personalElectricPower: false,
  gasified: false,
  registrationType: 'FREE'
};
