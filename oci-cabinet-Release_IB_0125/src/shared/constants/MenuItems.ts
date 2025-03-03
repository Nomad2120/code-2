// icons
import infoOutline from '@iconify-icons/eva/info-outline';
import settings2Outline from '@iconify-icons/eva/settings-2-outline';
import peopleOutline from '@iconify-icons/eva/people-outline';
import moneyWithdraw from '@iconify-icons/uil/money-withdraw';
import listFill from '@iconify-icons/eva/list-fill';
import chartLine from '@iconify-icons/uil/chart-line';
import commentExclamation from '@iconify-icons/uil/comment-exclamation';
import commentMessage from '@iconify-icons/uil/comment-message';
import chatBubbleUser from '@iconify-icons/uil/chat-bubble-user';
import moneyBill from '@iconify-icons/uil/money-bill';
import fileTextOutline from '@iconify-icons/eva/file-text-outline';
import receipt from '@iconify-icons/uil/receipt';

// routes
import { PATH_OSI } from '@app/routes/paths';
import { tokens } from '@shared/utils/i18n';

export const OSI_MENU_ITEMS = [
  {
    code: 'info',
    titleToken: tokens.osiRoot.osiInfo,
    path: PATH_OSI.info,
    active: false,
    icon: infoOutline
  },
  {
    code: 'services',
    titleToken: tokens.osiRoot.osiServices,
    path: PATH_OSI.services,
    active: false,
    icon: settings2Outline
  },
  {
    code: 'abonents',
    titleToken: tokens.osiRoot.osiAbonents,
    path: PATH_OSI.abonents,
    active: false,
    icon: peopleOutline
  },
  {
    code: 'accurals',
    titleToken: tokens.osiRoot.osiAccurals,
    path: PATH_OSI.accruals,
    active: false,
    icon: moneyWithdraw
  },
  {
    code: 'osv',
    titleToken: tokens.osiRoot.osiOsv,
    path: PATH_OSI.osv,
    active: false,
    icon: listFill
  },
  {
    code: 'payments',
    titleToken: tokens.osiRoot.osiPayments,
    path: PATH_OSI.payments,
    active: false,
    icon: moneyBill
  },
  {
    code: 'acts',
    titleToken: tokens.osiRoot.osiActs,
    path: PATH_OSI.acts,
    active: false,
    icon: fileTextOutline
  },
  {
    code: 'reports',
    titleToken: tokens.osiRoot.osiReports,
    path: PATH_OSI.reports,
    active: false,
    icon: chartLine
  },
  {
    code: 'debts',
    titleToken: tokens.osiRoot.osiDebts,
    path: PATH_OSI.debts,
    active: false,
    icon: chatBubbleUser
  },
  {
    code: 'invoices',
    titleToken: tokens.osiRoot.osiInvoices,
    path: PATH_OSI.invoices,
    active: false,
    icon: receipt
  },
  {
    code: 'forum',
    titleToken: tokens.osiRoot.osiForum,
    path: '#',
    active: false,
    icon: commentMessage
  },
  {
    code: 'inspection',
    titleToken: tokens.osiRoot.osiInspection,
    path: '#',
    active: false,
    icon: commentExclamation
  }
];
