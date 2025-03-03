import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { RootLayout } from '@app/layouts/RootLayout';
import ErrorPage from '@pages/ErrorPage';
import Loadable from '@/shared/common/Loadable';
import * as paths from './paths';

// Layouts

const HomeLayout = Loadable(lazy(() => import('@app/layouts/home')));
const CabinetLayout = Loadable(lazy(() => import('@app/layouts/cabinet')));
const OsiLayout = Loadable(lazy(() => import('@app/layouts/osi')));
const AppartmentLayout = Loadable(lazy(() => import('@app/layouts/appartment')));
const LogoOnlyLayout = Loadable(lazy(() => import('@app/layouts/LogoOnlyLayout')));

// IMPORT COMPONENTS
// Main
const HomePage = Loadable(lazy(() => import('../../pages/home/index')));
const NotFound = Loadable(lazy(() => import('../../pages/Page404')));
const Error = Loadable(lazy(() => import('../../pages/Page500')));
const Maintenance = Loadable(lazy(() => import('../../pages/Maintenance')));

// Auth
const Login = Loadable(lazy(() => import('@pages/auth/Login')));
const Register = Loadable(lazy(() => import('@pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('@pages/auth/ResetPassword')));
const SelectRole = Loadable(lazy(() => import('@pages/auth/SelectRole')));

// Cabinet
const CabinetRoot = Loadable(lazy(() => import('@pages/cabinet/ui')));
const OsiRegistration = Loadable(lazy(() => import('../../pages/cabinet/Registration')));
const UserProfile = Loadable(lazy(() => import('@pages/user/profile')));

// Osi
// const OsiRoot = Loadable(lazy(() => import('../../pages/osi/root')));
const OsiRoot = Loadable(lazy(() => import('../../pages/osi/root/ui')));
const OsiInfo = Loadable(lazy(() => import('../../pages/osi/infoV2')));
const OsiAbonents = Loadable(lazy(() => import('@pages/osi/abonents')));
const OsiAccruals = Loadable(lazy(() => import('@pages/osi/accruals')));
const OsiPayments = Loadable(lazy(() => import('@pages/osi/payments')));
const OsiOsv = Loadable(lazy(() => import('@pages/osi/osv')));
const OsiActs = Loadable(lazy(() => import('../../pages/osi/acts')));
const OsiWizard = Loadable(lazy(() => import('../../pages/osi/wizard')));
const OsiDebts = Loadable(lazy(() => import('@pages/osi/debts')));
const OsiInvoices = Loadable(lazy(() => import('@pages/osi/invoices')));
const OsiReports = Loadable(lazy(() => import('@pages/osi/reports')));

// Appartment
const AppartmentRoot = Loadable(lazy(() => import('@pages/appartment/root')));
const AppartmentOsiInfo = Loadable(lazy(() => import('@pages/appartment/osi-info')));
const AppartmentOsv = Loadable(lazy(() => import('@pages/appartment/osv')));
const AppartmentReports = Loadable(lazy(() => import('@pages/appartment/reports')));
const AppartmentInvoices = Loadable(lazy(() => import('@pages/appartmentInvoices')));

const { PATH_CABINET, PATH_APPARTMENT, PATH_OSI, PATH_HOME, PATH_AUTH } = paths;

const authRoutes: RouteObject = {
  path: PATH_AUTH.root,
  children: [
    {
      path: PATH_AUTH.login,
      Component: Login
    },
    {
      path: PATH_AUTH.loginDev,
      Component: Login
    },
    {
      path: PATH_AUTH.register,
      Component: Register
    },
    { path: PATH_AUTH.resetPassword, Component: ResetPassword },
    { path: PATH_AUTH.selectRole, Component: SelectRole }
  ]
};

const cabinetRoutes: RouteObject = {
  path: PATH_CABINET.root,
  Component: CabinetLayout,
  children: [
    { path: PATH_CABINET.root, Component: CabinetRoot },
    {
      path: PATH_CABINET.registration,
      Component: OsiRegistration
    },
    {
      path: PATH_CABINET.user,
      Component: UserProfile
    }
  ]
};

const osiRoutes: RouteObject = {
  path: PATH_OSI.root,
  Component: OsiLayout,
  children: [
    { path: PATH_OSI.root, Component: OsiRoot },
    {
      path: PATH_OSI.info,
      Component: OsiInfo
    },
    {
      path: PATH_OSI.abonents,
      Component: OsiAbonents
    },
    {
      path: PATH_OSI.accruals,
      Component: OsiAccruals
    },
    {
      path: PATH_OSI.payments,
      Component: OsiPayments
    },
    {
      path: PATH_OSI.osv,
      Component: OsiOsv
    },
    {
      path: PATH_OSI.acts,
      Component: OsiActs
    },
    {
      path: PATH_OSI.wizard,
      Component: OsiWizard
    },
    {
      path: PATH_OSI.debts,
      Component: OsiDebts
    },
    {
      path: PATH_OSI.invoices,
      Component: OsiInvoices
    },
    {
      path: PATH_OSI.reports,
      Component: OsiReports
    }
  ]
};

const apartmentRoutes: RouteObject = {
  path: PATH_APPARTMENT.root,
  Component: AppartmentLayout,
  children: [
    { path: PATH_APPARTMENT.root, Component: AppartmentRoot },
    {
      path: PATH_APPARTMENT.osi,
      Component: AppartmentOsiInfo
    },
    {
      path: PATH_APPARTMENT.osv,
      Component: AppartmentOsv
    },
    {
      path: PATH_APPARTMENT.reports,
      Component: AppartmentReports
    },
    {
      path: PATH_APPARTMENT.invoices,
      Component: AppartmentInvoices
    }
  ]
};

const mainRoutes: RouteObject = {
  path: '*',
  Component: LogoOnlyLayout,
  children: [
    { path: 'maintenance', Component: Maintenance },
    { path: '404', Component: NotFound },
    { path: '500', Component: Error },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]
};

const homeRoutes: RouteObject = {
  path: PATH_HOME.root,
  Component: HomeLayout,
  children: [{ path: '/', Component: HomePage }]
};

export const routesConfig: RouteObject[] = [
  {
    errorElement: <ErrorPage />,
    Component: RootLayout,
    children: [authRoutes, cabinetRoutes, osiRoutes, apartmentRoutes, mainRoutes, homeRoutes]
  }
];
