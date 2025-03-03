import { OsiAccountTypes } from '@shared/types/osi/accounts';
import { OsiAccountApplication, OsiAccountApplicationDoc } from '@shared/types/osiAccountApplications';

export const application: OsiAccountApplication = {
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
};

export const appDocsMock: OsiAccountApplicationDoc[] = [
  {
    docTypeCode: 'SAVING_IBAN_INFO',
    docTypeNameRu:
      'Выписка с реквизитами банковского счета открытого для сбора оплаты с жильцов дома за капитальный ремонт здания',
    docTypeNameKz:
      'Úı turǵyndarynan ǵımaratty kúrdeli jóndegeni úshin tólem jınaý úshin ashylǵan banktik shottyń derektemeleri bar úzindi kóshirme',
    scan: {
      fileName: 'account_application_13_SAVING_IBAN_INFO_638552730012825707.png',
      id: 7918
    },
    id: 6
  }
];
