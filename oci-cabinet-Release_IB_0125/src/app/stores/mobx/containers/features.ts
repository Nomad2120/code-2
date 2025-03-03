import {
  AddAccountButtonViewModelInterface,
  addAccountButtonViewModelToken,
  EditAccountButtonViewModelInterface,
  editAccountButtonViewModelToken,
  DeleteAccountButtonViewModelInterface,
  deleteAccountButtonViewModelToken
} from '@shared/types/mobx/features/osiAccounts';
import { AddAccountButtonFeature, EditAccountButtonFeature, DeleteAccountButtonFeature } from '@features/osi/accounts';
import { Container } from 'inversify';
import {
  AddServiceCompanyFeature,
  DeleteServiceCompanyFeature,
  EditServiceCompanyFeature,
  PrintServiceCheckboxFeature
} from '@features/osi/osiServiceCompanies';
import {
  AddOsiServiceCompanyButtonViewModelInterface,
  addOsiServiceCompanyButtonViewModelToken,
  DeleteOsiServiceCompanyButtonViewModelInterface,
  deleteOsiServiceCompanyButtonViewModelToken,
  EditOsiServiceCompanyButtonViewModelInterface,
  editOsiServiceCompanyButtonViewModelToken,
  IPrintServiceCheckboxFeatureViewModel,
  IPrintServiceCheckboxFeatureViewModelToken
} from '@shared/types/mobx/features/OsiServiceCompanies';
import { PenaltiesToggleViewModel } from '@features/osi/accruals/penaltiesToggle/model/ViewModel';
import {
  IAddAdditionalServiceButtonViewModel,
  IAddAdditionalServiceButtonViewModelToken,
  IAddServiceButtonFeatureViewModel,
  IAddServiceButtonFeatureViewModelToken,
  IEditAdditionalServiceFeatureViewModel,
  IEditAdditionalServiceFeatureViewModelToken,
  IEditServiceButtonFeatureViewModel,
  IEditServiceButtonFeatureViewModelToken,
  IOsiServiceAbonentsButtonFeatureViewModel,
  IOsiServiceAbonentsButtonFeatureViewModelToken,
  IPenaltiesToggleViewModel,
  IPenaltiesToggleViewModelToken
} from '@shared/types/mobx/features/osiAccruals';
import { AddServiceButtonFeatureViewModel } from '@features/osi/accruals/service/add';
import { EditButtonFeatureViewModel } from '@features/osi/accruals/service/edit';
import { OsiServiceAbonentsButtonFeatureViewModel } from '@features/osi/accruals/abonents';
import { AddAdditionalServiceButtonViewModel } from '@features/osi/accruals/additionalService/add';
import { EditAdditionalServiceFeatureViewModel } from '@features/osi/accruals/additionalService/edit';
import { ICreateDebtFeatureViewModel, ICreateDebtFeatureViewModelToken } from '@shared/types/mobx/features/OsiDebts';
import { CreateDebtFeatureViewModel } from '@features/osi/debts/createDebt';
import {
  IOsiCreatePaymentFeatureViewModel,
  IOsiCreatePaymentFeatureViewModelToken
} from '@shared/types/mobx/features/osiPayments';
import { OsiCreatePaymentFeatureViewModel } from '@features/osi/payments/createPayment';
import {
  IOsiCreateCorrectionFeatureViewModel,
  IOsiCreateCorrectionFeatureViewModelToken
} from '@shared/types/mobx/features/OsiCorrection';
import { OsiCreateCorrectionFeatureViewModel } from '@features/osi/correction/createCorrection';
import { IAccuralDateViewModel, IAccuralDateViewModelToken } from '@shared/types/mobx/features/OsiAccuralDate';
import { AccuralDateViewModel } from '@features/osi/accruals/accuralsDate';
import { ViewModel as AddAccountRegistrationButtonViewModel } from '@widgets/registration/accounts/model/AddAccountButtonViewModel';
import { addAccountButtonViewModelToken as addRegistrationAccountButtonViewModelToken } from '@shared/types/mobx/features/registration/accounts';
import { ViewModel as RemakeAccrualsViewModel } from '@features/osi/accruals/remakeAccruals';

const featuresContainer = new Container();

BindOsiAccounts();
BindOsiServiceCompanies();
BindOsiAccruals();
BindOsiDebts();
BindPayments();
BindCorrection();
BindOsiAccrualDate();
BindRegistrationFeatures();
BindRemakeAccruals();

function BindOsiAccounts() {
  featuresContainer
    .bind<AddAccountButtonViewModelInterface>(addAccountButtonViewModelToken)
    .to(AddAccountButtonFeature)
    .inTransientScope();
  featuresContainer
    .bind<EditAccountButtonViewModelInterface>(editAccountButtonViewModelToken)
    .to(EditAccountButtonFeature)
    .inTransientScope();
  featuresContainer
    .bind<DeleteAccountButtonViewModelInterface>(deleteAccountButtonViewModelToken)
    .to(DeleteAccountButtonFeature)
    .inTransientScope();
}

function BindOsiServiceCompanies() {
  featuresContainer
    .bind<AddOsiServiceCompanyButtonViewModelInterface>(addOsiServiceCompanyButtonViewModelToken)
    .to(AddServiceCompanyFeature)
    .inTransientScope();
  featuresContainer
    .bind<EditOsiServiceCompanyButtonViewModelInterface>(editOsiServiceCompanyButtonViewModelToken)
    .to(EditServiceCompanyFeature)
    .inTransientScope();
  featuresContainer
    .bind<DeleteOsiServiceCompanyButtonViewModelInterface>(deleteOsiServiceCompanyButtonViewModelToken)
    .to(DeleteServiceCompanyFeature)
    .inTransientScope();
  featuresContainer
    .bind<IPrintServiceCheckboxFeatureViewModel>(IPrintServiceCheckboxFeatureViewModelToken)
    .to(PrintServiceCheckboxFeature)
    .inTransientScope();
}

function BindOsiAccruals() {
  featuresContainer
    .bind<IPenaltiesToggleViewModel>(IPenaltiesToggleViewModelToken)
    .to(PenaltiesToggleViewModel)
    .inTransientScope();
  featuresContainer
    .bind<IAddServiceButtonFeatureViewModel>(IAddServiceButtonFeatureViewModelToken)
    .to(AddServiceButtonFeatureViewModel)
    .inTransientScope();
  featuresContainer
    .bind<IEditServiceButtonFeatureViewModel>(IEditServiceButtonFeatureViewModelToken)
    .to(EditButtonFeatureViewModel)
    .inTransientScope();
  featuresContainer
    .bind<IOsiServiceAbonentsButtonFeatureViewModel>(IOsiServiceAbonentsButtonFeatureViewModelToken)
    .to(OsiServiceAbonentsButtonFeatureViewModel)
    .inTransientScope();
  /** additional services */
  featuresContainer
    .bind<IAddAdditionalServiceButtonViewModel>(IAddAdditionalServiceButtonViewModelToken)
    .to(AddAdditionalServiceButtonViewModel)
    .inTransientScope();
  featuresContainer
    .bind<IEditAdditionalServiceFeatureViewModel>(IEditAdditionalServiceFeatureViewModelToken)
    .to(EditAdditionalServiceFeatureViewModel)
    .inTransientScope();
}

function BindOsiDebts() {
  featuresContainer
    .bind<ICreateDebtFeatureViewModel>(ICreateDebtFeatureViewModelToken)
    .to(CreateDebtFeatureViewModel)
    .inTransientScope();
}

function BindPayments() {
  featuresContainer
    .bind<IOsiCreatePaymentFeatureViewModel>(IOsiCreatePaymentFeatureViewModelToken)
    .to(OsiCreatePaymentFeatureViewModel)
    .inTransientScope();
}

function BindCorrection() {
  featuresContainer
    .bind<IOsiCreateCorrectionFeatureViewModel>(IOsiCreateCorrectionFeatureViewModelToken)
    .to(OsiCreateCorrectionFeatureViewModel)
    .inTransientScope();
}

function BindOsiAccrualDate() {
  featuresContainer.bind<IAccuralDateViewModel>(IAccuralDateViewModelToken).to(AccuralDateViewModel).inTransientScope();
}

function BindRegistrationFeatures() {
  featuresContainer
    .bind<AddAccountButtonViewModelInterface>(addRegistrationAccountButtonViewModelToken)
    .to(AddAccountRegistrationButtonViewModel)
    .inTransientScope();
}

function BindRemakeAccruals() {
  featuresContainer.bind<RemakeAccrualsViewModel>(RemakeAccrualsViewModel).toSelf().inRequestScope();
}

export default featuresContainer;
