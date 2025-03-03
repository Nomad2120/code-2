import { OsiAccountApplication } from '@shared/types/osiAccountApplications';
import { OsiAccountTypes } from '@shared/types/osi/accounts';

export const osiAccountApplications: OsiAccountApplication[] = [
  {
    osiId: 1,
    bic: '123456',
    account: '12345678901234567890',
    type: OsiAccountTypes.CURRENT,
    serviceGroupId: 1,
    id: 1,
    createDt: '2022-01-01T00:00:00Z',
    state: 'Active',
    rejectReason: null,
    oldBankBic: '654321',
    oldAccount: '09876543210987654321',
    applicationTypeText: 'UPDATE',
    stateText: 'Active',
    bankName: 'Bank1',
    accountTypeNameRu: 'Тип1'
  },
  {
    osiId: 2,
    bic: '654321',
    account: '09876543210987654321',
    type: OsiAccountTypes.SAVINGS,
    serviceGroupId: 2,
    id: 2,
    createDt: '2022-02-02T00:00:00Z',
    state: 'Pending',
    rejectReason: null,
    oldBankBic: '123456',
    oldAccount: '12345678901234567890',
    applicationTypeText: 'ADD',
    stateText: 'Pending',
    bankName: 'Bank2',
    accountTypeNameRu: 'Тип2'
  }
];
