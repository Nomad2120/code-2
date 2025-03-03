import { CabinetAccountViewModel } from '@entities/cabinet/account/model';
import { Container } from 'inversify';
import { RegistrationFormEditViewModel } from '@entities/registration/RegistrationForm/Edit/model/viewModel';
import { RegistrationFormCreateViewModel } from '@entities/registration/RegistrationForm/Create/model/viewModel';
import { RegistrationFormModel } from '@entities/registration/RegistrationForm/model/model';
import { RegistrationDocViewModel } from '@entities/registration/RegistrationDoc/model/RegistrationDocViewModel';
import { RegistrationDocModel } from '@entities/registration/RegistrationDoc/model/RegistrationDocModel';
import {
  IOsiServiceSaldoTableVmToken,
  IOsiServiceSaldoTableViewModel
} from '@shared/types/mobx/entities/osiServiceSaldo';
import { OsiServiceSaldoTableViewModel } from '@entities/osi/serviceSaldo';
import { IOsiPaymentFormViewModel, IOsiPaymentFormViewModelToken } from '@shared/types/mobx/entities/osiPayments';
import { OsiPaymentFormViewModel } from '@entities/osi/payments';
import {
  IOsiCorrectionFormViewModel,
  IOsiCorrectionFormViewModelToken
} from '@shared/types/mobx/entities/osiCorrections';
import { OsiCorrectionFormViewModel } from '@entities/osi/correction';
import { RegistrationSignViewModel } from '@/entities/registration/RegistrationSignForm/model/RegistrationSignViewModel';
import { RegistrationSignModel } from '@/entities/registration/RegistrationSignForm/model/RegistrationSignModel';

const container = new Container();

container.bind<CabinetAccountViewModel>(CabinetAccountViewModel).toSelf().inTransientScope();

BindRegistrationForm();
BindRegistrationDoc();
BindRegistrationSign();
BindOsiServiceSaldo();
BindOsiPayments();
BindOsiCorrection();

function BindRegistrationForm() {
  container.bind<RegistrationFormEditViewModel>(RegistrationFormEditViewModel).toSelf().inTransientScope();
  container.bind<RegistrationFormCreateViewModel>(RegistrationFormCreateViewModel).toSelf().inTransientScope();
  container.bind<RegistrationFormModel>(RegistrationFormModel).toSelf().inSingletonScope();
}

function BindRegistrationDoc() {
  container.bind<RegistrationDocViewModel>(RegistrationDocViewModel).toSelf().inTransientScope();
  container.bind<RegistrationDocModel>(RegistrationDocModel).toSelf().inSingletonScope();
}

function BindRegistrationSign() {
  container.bind<RegistrationSignViewModel>(RegistrationSignViewModel).toSelf().inSingletonScope();
  container.bind<RegistrationSignModel>(RegistrationSignModel).toSelf().inSingletonScope();
}

function BindOsiServiceSaldo() {
  container
    .bind<IOsiServiceSaldoTableViewModel>(IOsiServiceSaldoTableVmToken)
    .to(OsiServiceSaldoTableViewModel)
    .inTransientScope();
}

function BindOsiPayments() {
  container
    .bind<IOsiPaymentFormViewModel>(IOsiPaymentFormViewModelToken)
    .to(OsiPaymentFormViewModel)
    .inTransientScope();
}

function BindOsiCorrection() {
  container
    .bind<IOsiCorrectionFormViewModel>(IOsiCorrectionFormViewModelToken)
    .to(OsiCorrectionFormViewModel)
    .inTransientScope();
}

export default container;
