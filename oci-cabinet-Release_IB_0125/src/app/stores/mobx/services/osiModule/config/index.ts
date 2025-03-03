import { tokens } from '@shared/utils/i18n';
import { PATH_OSI } from '@app/routes/paths';
import infoOutline from '@iconify-icons/eva/info-outline';
// import settings2Outline from '@iconify-icons/eva/settings-2-outline';
import peopleOutline from '@iconify-icons/eva/people-outline';
import moneyWithdraw from '@iconify-icons/uil/money-withdraw';
import listFill from '@iconify-icons/eva/list-fill';
import moneyBill from '@iconify-icons/uil/money-bill';
import fileTextOutline from '@iconify-icons/eva/file-text-outline';
import chartLine from '@iconify-icons/uil/chart-line';
import chatBubbleUser from '@iconify-icons/uil/chat-bubble-user';
import receipt from '@iconify-icons/uil/receipt';
import { Osi, OsiDoc } from '@shared/types/osi';

enum OsiMenusCodes {
  info = 'info',
  // services = 'services',
  abonents = 'abonents',
  accurals = 'accurals',
  osv = 'osv',
  payments = 'payments',
  acts = 'acts',
  reports = 'reports',
  debts = 'debts',
  invoices = 'invoices'
}

interface OsiMenu {
  code: string;
  titleToken: string;
  path: string;
  active: boolean;
  icon: any;
  allowInFreeMode?: boolean;
}

export const OsiMenus: Record<OsiMenusCodes, OsiMenu> = {
  info: {
    code: 'info',
    titleToken: tokens.osiRoot.osiInfo,
    path: PATH_OSI.info,
    active: false,
    icon: infoOutline
  },
  // services: {
  //   code: 'services',
  //   titleToken: tokens.osiRoot.osiServices,
  //   path: PATH_OSI.services,
  //   active: false,
  //   icon: settings2Outline
  // },
  abonents: {
    code: 'abonents',
    titleToken: tokens.osiRoot.osiAbonents,
    path: PATH_OSI.abonents,
    active: false,
    icon: peopleOutline
  },
  accurals: {
    code: 'accurals',
    titleToken: tokens.osiRoot.osiAccurals,
    path: PATH_OSI.accruals,
    active: false,
    icon: moneyWithdraw
  },
  osv: {
    code: 'osv',
    titleToken: tokens.osiRoot.osiOsv,
    path: PATH_OSI.osv,
    active: false,
    icon: listFill
  },
  payments: {
    code: 'payments',
    titleToken: tokens.osiRoot.osiPayments,
    path: PATH_OSI.payments,
    active: false,
    icon: moneyBill
  },
  acts: {
    code: 'acts',
    titleToken: tokens.osiRoot.osiActs,
    path: PATH_OSI.acts,
    active: false,
    icon: fileTextOutline
  },
  reports: {
    code: 'reports',
    titleToken: tokens.osiRoot.osiReports,
    path: PATH_OSI.reports,
    active: false,
    icon: chartLine,
    allowInFreeMode: true
  },
  debts: {
    code: 'debts',
    titleToken: tokens.osiRoot.osiDebts,
    path: PATH_OSI.debts,
    active: false,
    icon: chatBubbleUser
  },
  invoices: {
    code: 'invoices',
    titleToken: tokens.osiRoot.osiInvoices,
    path: PATH_OSI.invoices,
    active: false,
    icon: receipt
  }
};

interface OsiModuleValues {
  osiId: number | null;
  osiInfo: Osi | null;
  osiDocs: OsiDoc[] | null;
  osiMenus: Record<OsiMenusCodes, OsiMenu>;
  isLoading: boolean;
  isLockedMenus: boolean;
}

export const initialValues: OsiModuleValues = {
  osiId: null,
  osiInfo: null,
  osiDocs: null,
  osiMenus: OsiMenus,
  isLoading: false,
  isLockedMenus: false
};
