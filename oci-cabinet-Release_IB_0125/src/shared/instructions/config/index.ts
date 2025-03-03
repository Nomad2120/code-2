import { Tabs } from '@shared/tabs';

export const links = {
  info: 'info',
  abonents: 'abonents',
  accruals: 'accruals',
  osv: 'osv',
  payments: 'payments',
  acts: 'acts',
  reports: 'reports',
  debts: 'debts',
  invoices: 'invoices',
  auth: 'auth',
  cabinet: 'cabinet'
};

export const timeJumps = {
  [Tabs.OSI_INFO]: 0,
  [Tabs.ACCOUNTS]: 24,
  [Tabs.SERVICE_COMPANIES]: 80.5,
  [Tabs.ACCRUALS]: 0,
  [Tabs.SALDO]: 197,
  [Tabs.DEBT_PERIODS]: 0,
  [Tabs.SAMPLE_DOCUMENTS]: 59,
  [Tabs.OSI_INVOICES]: 0,
  [Tabs.OSI_QRPAGE]: 49,
  [Tabs.OSI_OSV]: 0,
  [Tabs.FLAT_OSV]: 40,
  [Tabs.ACCURALS_BY_ABONENT]: 53,
  [Tabs.PAYMENT_ORDERS]: 66,
  [Tabs.OSI_PAYMENTS]: 0,
  [Tabs.OSI_FIXES]: 60.5,
  [Tabs.OSI_SYSTEM_REPORTS]: 0,
  [Tabs.ALL_ACCOUNT_REPORTS]: 10
};
