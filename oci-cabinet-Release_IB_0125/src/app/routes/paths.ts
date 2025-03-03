function path(root: any, sublink: any) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';

const ROOTS = {
  auth: '/auth',
  app: '/app',
  cabinet: '/cabinet',
  osi: '/osi',
  appartment: '/appartment',
  docs: '/docs'
};

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginDev: path(ROOTS_AUTH, '/login-dev'),
  register: path(ROOTS_AUTH, '/register'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  selectRole: path(ROOTS.auth, '/select-role')
};

export const PATH_HOME = {
  dashboard: ROOTS.app,
  root: '/'
};

export const PATH_CABINET = {
  root: ROOTS.cabinet,
  user: path(ROOTS.cabinet, '/user'),
  registration: path(ROOTS.cabinet, '/registration')
};

export const PATH_OSI = {
  root: ROOTS.osi,
  info: path(ROOTS.osi, '/info'),
  abonents: path(ROOTS.osi, '/abonents'),
  services: path(ROOTS.osi, '/services'),
  wizard: path(ROOTS.osi, '/wizard'),
  accruals: path(ROOTS.osi, '/accruals'),
  osv: path(ROOTS.osi, '/osv'),
  payments: path(ROOTS.osi, '/payments'),
  acts: path(ROOTS.osi, '/acts'),
  debts: path(ROOTS.osi, '/debts'),
  invoices: path(ROOTS.osi, '/invoices'),
  reports: path(ROOTS.osi, '/reports')
};

export const PATH_APPARTMENT = {
  root: ROOTS.appartment,
  osi: path(ROOTS.appartment, '/osi'),
  osv: path(ROOTS.appartment, '/osv'),
  reports: path(ROOTS.appartment, '/reports'),
  invoices: path(ROOTS.appartment, '/invoices')
};
