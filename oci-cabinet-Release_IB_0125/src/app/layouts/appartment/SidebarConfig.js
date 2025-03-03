// icons
import infoOutline from '@iconify-icons/eva/info-outline';
import listFill from '@iconify-icons/eva/list-fill';
import chartLine from '@iconify-icons/uil/chart-line';
import receipt from '@iconify-icons/uil/receipt';
// routes
import { PATH_APPARTMENT } from '../../routes/paths';
import { tokens } from '../../../shared/utils/i18n';

// ----------------------------------------------------------------------

export const MENU_ITEMS = [
  {
    code: 'info',
    title: 'Сведения об ОСИ',
    titleToken: tokens.osiRoot.osiInfo,
    path: PATH_APPARTMENT.osi,
    active: true,
    icon: infoOutline
  },
  {
    code: 'osv',
    title: 'Сальдо',
    titleToken: tokens.osiRoot.osiOsv,
    path: PATH_APPARTMENT.osv,
    active: true,
    icon: listFill
  },
  {
    code: 'reports',
    title: 'Отчеты',
    titleToken: tokens.osiRoot.osiReports,
    path: PATH_APPARTMENT.reports,
    active: true,
    icon: chartLine
  },
  {
    code: 'invoices',
    title: 'Квитанции',
    titleToken: tokens.osiRoot.osiInvoices,
    path: PATH_APPARTMENT.invoices,
    active: true,
    icon: receipt
  }
];

const sidebarConfig = [
  // OSI
  // ----------------------------------------------------------------------
  {
    subheader: 'КАБИНЕТ АБОНЕНТА',
    items: MENU_ITEMS
  }
];

export default sidebarConfig;
