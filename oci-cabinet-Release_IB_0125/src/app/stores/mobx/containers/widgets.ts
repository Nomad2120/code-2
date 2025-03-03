import { Container } from 'inversify';
import { SelectRoleViewModel } from '@widgets/selectRole/model/SelectRoleViewModel';
import { OsiListViewModel } from '@widgets/osiList/model';
import { RegistrationViewModel } from '@widgets/registration/model';
import { RegistrationDocsViewModel } from '@widgets/registration/docs/model/RegistrationDocsViewModel';
import { RegistrationDocsModel } from '@widgets/registration/docs/model/registrationDocsModel';
import { StepsWidgetViewModel } from '@widgets/wizard/model/StepsWidgetViewModel';
import { LoginViewModel } from '@widgets/auth/login/model/LoginViewModel';
import { AccountReportsViewModel } from '@widgets/osi/accountReports/model/viewModel';
import { AllAccountReportsViewModel } from '@widgets/osi/accountReports/allAccountReports/model/viewModel';
import { AppartmentReportsViewModel } from '@widgets/appartment/accountReports/model';
import { RegistrationWidgetViewModel } from '@widgets/authRegistration/model/viewModel';
import { OsiActsWidgetViewModel } from '@widgets/osiActs/model/viewModel';
import { InvoicesWidgetViewModel } from '@widgets/appartmentInvoices/model/viewModel';
import { OsiInfoWidgetViewModel, token as OsiInfoWidgetVmToken } from '@shared/types/mobx/widgets/OsiInfoWidget';
import { OsiInfoWidgetVm } from '@widgets/osi/info';
import {
  OsiAccountsWidgetViewModel,
  token as OsiAccountsWidgetVmToken
} from '@shared/types/mobx/widgets/OsiAccountsWidget';
import { OsiAccountsWidgetVm } from '@widgets/osi/accounts';
import {
  OsiServiceCompaniesWidgetViewModel,
  token as OsiServiceCompaniesWidgetVmToken
} from '@shared/types/mobx/widgets/OsiServiceCompaniesWidget';
import { OsiServiceCompaniesVm } from '@widgets/osi/osiServiceCompanies';
import {
  IOsiAccrualsWidgetViewModel,
  token as IOsiAccrualsWidgetVmToken
} from '@shared/types/mobx/widgets/OsiAccrualsWidget';
import { OsiAccrualsWidgetViewModel } from '@widgets/osi/accruals';
import {
  IOsiSystemReportsWidgetVmToken,
  IOsiSystemReportsWidgetViewModel
} from '@shared/types/mobx/widgets/OsiSystemReports';
import { OsiSystemReportsWidgetViewModel } from '@widgets/osi/systemReports';
import {
  IOsiServiceSaldoWidgetViewModel,
  IOsiServiceSaldoWidgetVmToken
} from '@shared/types/mobx/widgets/OsiServiceSaldo';
import { OsiServiceSaldoWidgetViewModel } from '@widgets/osi/osiServiceSaldo';
import {
  IOsiAbonentsWidgetViewModel,
  IOsiAbonentsWidgetViewModelToken
} from '@shared/types/mobx/widgets/OsiAbonentsWidget';
import { OsiAbonentsWidgetViewModel } from '@widgets/osi/abonents';
import { IOsiDebtsWidgetViewModel, IOsiDebtsWidgetViewModelToken } from '@shared/types/mobx/widgets/OsiDebtsWidget';
import { OsiDebtsWidgetViewModel } from '@widgets/osi/debts';
import {
  IOsiSampleDocumentsWidgetViewModel,
  IOsiSampleDocumentsWidgetViewModelToken
} from '@shared/types/mobx/widgets/OsiSampleDocuments';
import { OsiSampleDocumentsWidgetViewModel } from '@widgets/osi/sampleDocuments';
import {
  IQrCodeInvoicesWidgetViewModel,
  IQrCodeInvoicesWidgetViewModelToken
} from '@shared/types/mobx/widgets/OsiInvoicesQrCode';
import { OsiInvoicesWidgetViewModel, QrCodeInvoicesWidgetViewModel } from '@widgets/osi/invoices';
import {
  IOsiInvoicesWidgetViewModel,
  IOsiInvoicesWidgetViewModelToken
} from '@shared/types/mobx/widgets/OsiInvoicesWidget';
import { IOsiOsvWidgetViewModel, IOsiOsvWidgetViewModelToken } from '@shared/types/mobx/widgets/OsiOsvWidget';
import { OsiOsvWidgetViewModel } from '@widgets/osi/osv';
import {
  IOsiFlatOsvWidgetViewModel,
  IOsiFlatOsvWidgetViewModelToken
} from '@shared/types/mobx/widgets/OsiFlatOsvWidget';
import { OsiFlatOsvWidgetViewModel } from '@widgets/osi/flatOsv';
import {
  IOsiPaymentOrdersWidgetViewModel,
  IOsiPaymentOrdersWidgetViewModelToken
} from '@shared/types/mobx/widgets/OsiPaymentOrdersWidget';
import { OsiPaymentOrdersWidgetViewModel } from '@widgets/osi/paymentOrders';
import {
  IOsiAccrualsByAbonentViewModel,
  IOsiAccrualsByAbonentViewModelToken
} from '@shared/types/mobx/widgets/OsiAccrualsByAbonentWidget';
import { OsiAccrualsByAbonentViewModel } from '@widgets/osi/accrualsByAbonent';
import { IOsiPaymentsWidgetViewModel, IOsiPaymentsWidgetViewModelToken } from '@shared/types/mobx/widgets/OsiPayments';
import { OsiPaymentsWidgetViewModel } from '@widgets/osi/payments';
import {
  IOsiCorrectionWidgetViewModel,
  IOsiCorrectionWidgetViewModelToken
} from '@shared/types/mobx/widgets/OsiCorrection';
import { OsiCorrectionWidgetViewModel } from '@widgets/osi/correction';
import {
  IAccountGeneralWidgetViewModel,
  IAccountGeneralWidgetViewModelToken
} from '@shared/types/mobx/widgets/AccountGeneral';
import { AccountGeneralWidgetViewModel } from '@widgets/accountGeneral';
import { AccountChangePasswordWidgetViewModel } from '@widgets/accountChangePassword';
import {
  IAccountChangePasswordWidgetViewModel,
  IAccountChangePasswordWidgetViewModelToken
} from '@shared/types/mobx/widgets/AccountChangePassword';
import { CreateRegistrationWidgetViewModel } from '@widgets/createRegistration';
import {
  ICreateRegistrationWidgetViewModel,
  ICreateRegistrationWidgetViewModelToken
} from '@shared/types/mobx/widgets/CreateRegistrationWidget';
import {
  IRegistrationAccountsWidgetViewModel,
  IRegistrationAccountsWidgetViewModelToken
} from '@shared/types/mobx/widgets/RegistrationAccounts';
import { RegistrationAccountsWidgetViewModel } from '@widgets/registration/accounts';
import { TimerState } from '@widgets/authRegistration/model/timerState';
import {
  IRegistrationDocumentsViewModel,
  RegistrationDocumentsViewModelToken
} from '@shared/types/mobx/widgets/RegistrationDocuments';
import { RegistrationDocumentsViewModel } from '@widgets/registration/documents/model';
import {
  IOsiAccountApplicationsWidgetViewModel,
  IOsiAccountApplicationsWidgetViewModelToken
} from '@shared/types/mobx/widgets/OsiAccountApplications';
import { OsiAccountApplicationsWidgetViewModel } from '@widgets/osi/accountApplications';
import { UserRegistrationViewModel } from '@widgets/userRegistrations';
import {
  IUserRegistrationsViewModel,
  token as IUserRegistrationsViewModelToken
} from '@shared/types/mobx/widgets/UserRegistrations';
import { CabinetSidebarViewModel } from '@entities/cabinet/sidebar/model';
import {
  RegistrationWizardViewModel,
  token as IRegistrationWizardViewModelToken
} from '@widgets/registrationWizard/store/RegistrationWizardViewModel';
import {
  RegistrationDocsViewModel as RegistrationDocsViewModelNew,
  token as IRegistrationDocsViewModelNewToken
} from '@widgets/registrationWizard/store/RegistrationDocs/RegistrationDocsViewModel';
import { RegistrationInfoCreateViewModel } from '@widgets/registrationWizard/store/RegistrationInfo/create';
import { RegistrationInfoEditViewModel } from '@widgets/registrationWizard/store/RegistrationInfo/edit';
import { token as IRegistrationSignViewModelToken } from '@shared/types/mobx/RegistrationSignViewModel';
import { RegistrationSignViewModel } from '@widgets/registrationWizard/store/RegistrationSign/RegistrationSignViewModel';
import { RegistrationModalsViewModel } from '@widgets/registrationWizard/store/RegistrationModals/RegistrationModalsViewModel';

const widgetsContainer = new Container();

widgetsContainer.bind<SelectRoleViewModel>(SelectRoleViewModel).toSelf().inTransientScope();
widgetsContainer.bind<OsiListViewModel>(OsiListViewModel).toSelf().inSingletonScope();
widgetsContainer.bind<CabinetSidebarViewModel>(CabinetSidebarViewModel).toSelf().inTransientScope();
widgetsContainer.bind<StepsWidgetViewModel>(StepsWidgetViewModel).toSelf().inSingletonScope();
widgetsContainer.bind<LoginViewModel>(LoginViewModel).toSelf().inTransientScope();
widgetsContainer.bind<AccountReportsViewModel>(AccountReportsViewModel).toSelf().inSingletonScope();
widgetsContainer.bind<AppartmentReportsViewModel>(AppartmentReportsViewModel).toSelf().inSingletonScope();

BindRegistration();
BindAllAccountReports();
BindRegistrationWidget();
BindOsiActs();
BindAppartmentInvoices();
BindOsiInfo();
BindOsiAccounts();
BindOsiServiceCompanies();
BindOsiAccruals();
BindOsiSystemReports();
BindOsiServiceSaldo();
BindOsiAbonents();
BindOsiDebts();
BindSampleDocuments();
BindInvoices();
BindOsv();
BindPayments();
BindCorrection();
BindAccountGeneral();
BindAccountChangePassword();
BindCreateRegistration();
BindRegistrationAccounts();
BindRegistrationDocuments();
BindOsiAccountApplications();
BindUserRegistration();
BindRegistrationWizard();

function BindRegistration() {
  widgetsContainer.bind<RegistrationViewModel>(RegistrationViewModel).toSelf().inSingletonScope();
  widgetsContainer.bind<RegistrationDocsModel>(RegistrationDocsModel).toSelf().inSingletonScope();
  widgetsContainer.bind<RegistrationDocsViewModel>(RegistrationDocsViewModel).toSelf().inSingletonScope();
}

function BindAllAccountReports() {
  widgetsContainer.bind<AllAccountReportsViewModel>(AllAccountReportsViewModel).toSelf().inSingletonScope();
}

function BindRegistrationWidget() {
  widgetsContainer.bind<RegistrationWidgetViewModel>(RegistrationWidgetViewModel).toSelf().inTransientScope();
  widgetsContainer.bind<TimerState>(TimerState).toSelf().inTransientScope();
}

function BindOsiActs() {
  widgetsContainer.bind<OsiActsWidgetViewModel>(OsiActsWidgetViewModel).toSelf().inTransientScope();
}

function BindAppartmentInvoices() {
  widgetsContainer.bind<InvoicesWidgetViewModel>(InvoicesWidgetViewModel).toSelf().inTransientScope();
}

function BindOsiInfo() {
  widgetsContainer.bind<OsiInfoWidgetViewModel>(OsiInfoWidgetVmToken).to(OsiInfoWidgetVm).inTransientScope();
}

function BindOsiAccounts() {
  widgetsContainer
    .bind<OsiAccountsWidgetViewModel>(OsiAccountsWidgetVmToken)
    .to(OsiAccountsWidgetVm)
    .inTransientScope();
}

function BindOsiServiceCompanies() {
  widgetsContainer
    .bind<OsiServiceCompaniesWidgetViewModel>(OsiServiceCompaniesWidgetVmToken)
    .to(OsiServiceCompaniesVm)
    .inTransientScope();
}

function BindOsiAccruals() {
  widgetsContainer
    .bind<IOsiAccrualsWidgetViewModel>(IOsiAccrualsWidgetVmToken)
    .to(OsiAccrualsWidgetViewModel)
    .inTransientScope();
}

function BindOsiSystemReports() {
  widgetsContainer
    .bind<IOsiSystemReportsWidgetViewModel>(IOsiSystemReportsWidgetVmToken)
    .to(OsiSystemReportsWidgetViewModel)
    .inTransientScope();
}

function BindOsiServiceSaldo() {
  widgetsContainer
    .bind<IOsiServiceSaldoWidgetViewModel>(IOsiServiceSaldoWidgetVmToken)
    .to(OsiServiceSaldoWidgetViewModel)
    .inTransientScope();
}

function BindOsiAbonents() {
  widgetsContainer
    .bind<IOsiAbonentsWidgetViewModel>(IOsiAbonentsWidgetViewModelToken)
    .to(OsiAbonentsWidgetViewModel)
    .inTransientScope();
}

function BindOsiDebts() {
  widgetsContainer
    .bind<IOsiDebtsWidgetViewModel>(IOsiDebtsWidgetViewModelToken)
    .to(OsiDebtsWidgetViewModel)
    .inTransientScope();
}

function BindSampleDocuments() {
  widgetsContainer
    .bind<IOsiSampleDocumentsWidgetViewModel>(IOsiSampleDocumentsWidgetViewModelToken)
    .to(OsiSampleDocumentsWidgetViewModel)
    .inTransientScope();
}

function BindInvoices() {
  widgetsContainer
    .bind<IQrCodeInvoicesWidgetViewModel>(IQrCodeInvoicesWidgetViewModelToken)
    .to(QrCodeInvoicesWidgetViewModel)
    .inTransientScope();
  widgetsContainer
    .bind<IOsiInvoicesWidgetViewModel>(IOsiInvoicesWidgetViewModelToken)
    .to(OsiInvoicesWidgetViewModel)
    .inTransientScope();
}

function BindOsv() {
  widgetsContainer
    .bind<IOsiOsvWidgetViewModel>(IOsiOsvWidgetViewModelToken)
    .to(OsiOsvWidgetViewModel)
    .inTransientScope();
  widgetsContainer
    .bind<IOsiFlatOsvWidgetViewModel>(IOsiFlatOsvWidgetViewModelToken)
    .to(OsiFlatOsvWidgetViewModel)
    .inTransientScope();
  widgetsContainer
    .bind<IOsiAccrualsByAbonentViewModel>(IOsiAccrualsByAbonentViewModelToken)
    .to(OsiAccrualsByAbonentViewModel)
    .inTransientScope();
  widgetsContainer
    .bind<IOsiPaymentOrdersWidgetViewModel>(IOsiPaymentOrdersWidgetViewModelToken)
    .to(OsiPaymentOrdersWidgetViewModel)
    .inTransientScope();
}

function BindPayments() {
  widgetsContainer
    .bind<IOsiPaymentsWidgetViewModel>(IOsiPaymentsWidgetViewModelToken)
    .to(OsiPaymentsWidgetViewModel)
    .inTransientScope();
}

function BindCorrection() {
  widgetsContainer
    .bind<IOsiCorrectionWidgetViewModel>(IOsiCorrectionWidgetViewModelToken)
    .to(OsiCorrectionWidgetViewModel)
    .inTransientScope();
}

function BindAccountGeneral() {
  widgetsContainer
    .bind<IAccountGeneralWidgetViewModel>(IAccountGeneralWidgetViewModelToken)
    .to(AccountGeneralWidgetViewModel)
    .inTransientScope();
}

function BindAccountChangePassword() {
  widgetsContainer
    .bind<IAccountChangePasswordWidgetViewModel>(IAccountChangePasswordWidgetViewModelToken)
    .to(AccountChangePasswordWidgetViewModel)
    .inTransientScope();
}

function BindCreateRegistration() {
  widgetsContainer
    .bind<ICreateRegistrationWidgetViewModel>(ICreateRegistrationWidgetViewModelToken)
    .to(CreateRegistrationWidgetViewModel)
    .inTransientScope();
}

function BindRegistrationAccounts() {
  widgetsContainer
    .bind<IRegistrationAccountsWidgetViewModel>(IRegistrationAccountsWidgetViewModelToken)
    .to(RegistrationAccountsWidgetViewModel)
    .inTransientScope();
}

function BindRegistrationDocuments() {
  widgetsContainer
    .bind<IRegistrationDocumentsViewModel>(RegistrationDocumentsViewModelToken)
    .to(RegistrationDocumentsViewModel)
    .inTransientScope();
}

function BindOsiAccountApplications() {
  widgetsContainer
    .bind<IOsiAccountApplicationsWidgetViewModel>(IOsiAccountApplicationsWidgetViewModelToken)
    .to(OsiAccountApplicationsWidgetViewModel)
    .inTransientScope();
}

function BindUserRegistration() {
  widgetsContainer
    .bind<IUserRegistrationsViewModel>(IUserRegistrationsViewModelToken)
    .to(UserRegistrationViewModel)
    .inTransientScope();
}

function BindRegistrationWizard() {
  widgetsContainer.bind(IRegistrationWizardViewModelToken).to(RegistrationWizardViewModel).inSingletonScope();
  widgetsContainer.bind(IRegistrationDocsViewModelNewToken).to(RegistrationDocsViewModelNew).inTransientScope();
  widgetsContainer.bind(RegistrationInfoCreateViewModel).to(RegistrationInfoCreateViewModel).inTransientScope();
  widgetsContainer.bind(RegistrationInfoEditViewModel).to(RegistrationInfoEditViewModel).inTransientScope();
  widgetsContainer.bind(IRegistrationSignViewModelToken).to(RegistrationSignViewModel).inTransientScope();
  widgetsContainer.bind(RegistrationModalsViewModel).toSelf().inSingletonScope();
}

export default widgetsContainer;
