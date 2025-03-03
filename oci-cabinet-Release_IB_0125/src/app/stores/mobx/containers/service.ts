import { SettingsStore } from '@mobx/services/SettingsStore';
import { Container } from 'inversify';
import { ProfileModule } from '@mobx/services/profile';
import { ProfileModel } from '@mobx/services/profile/model';
import { PartialInvoicesStore } from '@widgets/partial-invoices-table';
import { AuthModule } from '@mobx/services/auth';
import { AuthModel } from '@mobx/services/auth/model';
import { RegistrationModule } from '@mobx/services/registration';
import { RegistrationModel } from '@mobx/services/registration/model';

import { configurePersistable } from 'mobx-persist-store';
import { RolesModule } from '@mobx/services/roles';
import { AccountReportsModel } from '@mobx/services/osi/accountReports/model';
import { AccountReportsModule } from '@mobx/services/osi/accountReports';
import { AppartmentsModule } from '@mobx/services/appartments';
import { HistoryModule } from '@mobx/services/history';

import { router } from '@app/routes';
import { DictionaryModule } from '@mobx/services/dictionaries/model/DictionaryModule';
import { InstructionsModule } from '@mobx/services/instructions';
import { ContactService } from '@shared/side-home/model/ContactService';
import { OsiModule } from '../services/osiModule';

configurePersistable(
  { storage: window.localStorage, expireIn: 86400000, removeOnExpiration: true, stringify: true, debugMode: false },
  { fireImmediately: true }
);

const serviceContainer = new Container();

BindAuthModule();
BindProfile();
BindSettings();
BindPartialInvoices();
BindRoles();
BindAccountReports();
BindAppartments();
BindRegistration();
BindHistory();
BindOsiModule();
BindDictionaries();
BindInstructions();
BindContactService();

function BindAuthModule() {
  serviceContainer.bind<AuthModule>(AuthModule).toSelf().inSingletonScope();
  serviceContainer.bind<AuthModel>(AuthModel).toSelf().inSingletonScope();
}

function BindProfile() {
  serviceContainer.bind<ProfileModule>(ProfileModule).toSelf().inSingletonScope();
  serviceContainer.bind<ProfileModel>(ProfileModel).toSelf().inSingletonScope();
}

function BindSettings() {
  serviceContainer.bind<SettingsStore>(SettingsStore).toSelf().inSingletonScope();
}

function BindPartialInvoices() {
  serviceContainer.bind<PartialInvoicesStore>(PartialInvoicesStore).toSelf().inSingletonScope();
}

function BindRegistration() {
  serviceContainer.bind<RegistrationModule>(RegistrationModule).toSelf().inSingletonScope();
  serviceContainer.bind<RegistrationModel>(RegistrationModel).toSelf().inSingletonScope();
}

function BindRoles() {
  serviceContainer.bind<RolesModule>(RolesModule).toSelf().inSingletonScope();
}

function BindAccountReports() {
  serviceContainer.bind<AccountReportsModule>(AccountReportsModule).toSelf().inSingletonScope();
  serviceContainer.bind<AccountReportsModel>(AccountReportsModel).toSelf().inSingletonScope();
}

function BindAppartments() {
  serviceContainer.bind<AppartmentsModule>(AppartmentsModule).toSelf().inSingletonScope();
}

function BindHistory() {
  serviceContainer.bind<HistoryModule>(HistoryModule).toSelf().inSingletonScope();
  serviceContainer.resolve(HistoryModule).setRouter(router);
}

function BindOsiModule() {
  serviceContainer.bind<OsiModule>(OsiModule).toSelf().inSingletonScope();
}

function BindDictionaries() {
  serviceContainer.bind<DictionaryModule>(DictionaryModule).toSelf().inSingletonScope();
}

function BindInstructions() {
  serviceContainer.bind<InstructionsModule>(InstructionsModule).toSelf().inSingletonScope();
}

function BindContactService() {
  serviceContainer.bind<ContactService>(ContactService).toSelf().inSingletonScope();
}

export default serviceContainer;
