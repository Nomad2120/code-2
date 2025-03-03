/* eslint-disable class-methods-use-this */
import { instance } from '@shared/api/config';
import { CORE_PATH, DOC_PATH, EAR_PATH } from '@shared/api/paths';

class Api {
  Auth(phone, otp) {
    return instance.post(`${CORE_PATH}/Auth?username=${phone}&password=${otp}`);
  }

  AuthCheckContact(phone) {
    return instance.get(`${CORE_PATH}/Auth/check-contact/${phone}`);
  }

  AuthVerifyCode(phone, verifyCode) {
    return instance.get(`${CORE_PATH}/Auth/verify-otp/${phone}/${verifyCode}`);
  }

  AuthGenerateOtp(phone) {
    return instance.get(`${CORE_PATH}/Auth/generate-otp/${phone}`);
  }

  // Dictionary
  DictionaryAreaTypes() {
    return instance.get(`${CORE_PATH}/Catalogs/area-types`);
  }

  DictionaryBanks() {
    return instance.get(`${CORE_PATH}/Catalogs/banks`);
  }

  DictionaryDocTypes() {
    return instance.get(`${CORE_PATH}/Catalogs/doc-types`);
  }

  DictionaryKnp() {
    return instance.get(`${CORE_PATH}/Catalogs/knp`);
  }

  DictionaryAccountTypes() {
    return instance.get(`${CORE_PATH}/Catalogs/account-types`);
  }

  DictionaryHouseStates() {
    return instance.get(`${CORE_PATH}/Catalogs/house-states`);
  }

  DictionaryServiceCompanies() {
    return instance.get(`${CORE_PATH}/Catalogs/service-companies`);
  }

  DictionaryServiceGroups() {
    return instance.get(`${CORE_PATH}/Catalogs/service-groups`);
  }

  // Users
  UsersGetInfo() {
    return instance.get(`${CORE_PATH}/Users`);
  }

  UsersChangeInfo(userId, payload) {
    return instance.put(`${CORE_PATH}/Users/${userId}`, payload);
  }

  UsersSetPassword(userId, password) {
    return instance({
      method: 'PUT',
      url: `${CORE_PATH}/Users/${userId}/set-password`,
      data: JSON.stringify(password)
    });
  }

  UsersResetPassword(userId, otp, newPassword, confirmPassword) {
    return instance({
      method: 'PUT',
      url: `${CORE_PATH}/Users/${userId}/reset-password`,
      data: {
        otp,
        newPassword,
        confirmPassword
      }
    });
  }

  UsersChangePassword(userId, payload) {
    return instance.put(`${CORE_PATH}/Users/${userId}/change-password`, payload);
  }

  UsersRegistrations(userId) {
    return instance.get(`${CORE_PATH}/Users/${userId}/registrations`);
  }

  UsersOsis(userId) {
    return instance.get(`${CORE_PATH}/Users/${userId}/osi`);
  }

  UsersAppartments(userId) {
    return instance.get(`${CORE_PATH}/Users/${userId}/affiliations`);
  }

  // Registrations
  RegistrationCreate(payload) {
    return instance.post(`${CORE_PATH}/Registrations`, payload);
  }

  RegistrationUpdate(id, payload) {
    return instance.put(`${CORE_PATH}/Registrations/${id}`, payload);
  }

  Registration(id) {
    return instance.get(`${CORE_PATH}/Registrations/${id}`);
  }

  RegistrationSign(id, sign) {
    return instance({
      method: 'PUT',
      url: `${CORE_PATH}/Registrations/${id}/sign`,
      data: JSON.stringify(sign)
    });
  }

  RegistrationDocs(id) {
    return instance.get(`${CORE_PATH}/Registrations/${id}/docs`);
  }

  RegistrationUpdateDoc(id, payload) {
    return instance.post(`${CORE_PATH}/Registrations/${id}/docs`, payload);
  }

  RegistrationDeleteDoc(id, docId) {
    return instance.delete(`${CORE_PATH}/Registrations/${id}/docs/${docId}`);
  }

  RegistrationReqDoc(regId) {
    return instance.get(`${CORE_PATH}/Registrations/reqdocs?registrationId=${regId}`);
  }

  // Scans
  Scan(id) {
    return instance.get(`${CORE_PATH}/Scans/${id}`);
  }

  // Osi
  Osi(id) {
    return instance.get(`${CORE_PATH}/Osi/${id}`);
  }

  OsiUpdate(id, payload) {
    return instance.put(`${CORE_PATH}/Osi/${id}`, payload);
  }

  OsiWizardStep(id, step) {
    return instance({
      method: 'PUT',
      url: `${CORE_PATH}/Osi/${id}/wizard-step`,
      data: step,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  OsiDocs(id) {
    return instance.get(`${CORE_PATH}/Osi/${id}/docs`);
  }

  OsiAddDoc(id, payload) {
    return instance.post(`${CORE_PATH}/Osi/${id}/docs`, payload);
  }

  OsiDeleteDoc(id, scanId) {
    return instance.delete(`${CORE_PATH}/Osi/${id}/docs/${scanId}`);
  }

  OsiAbonents(id) {
    return instance.get(`${CORE_PATH}/Osi/${id}/abonents`);
  }

  OsiServices(id) {
    return instance.get(`${CORE_PATH}/Osi/${id}/services`);
  }

  OsiServicesV2(id) {
    return instance.get(`${CORE_PATH}/Osi/${id}/v2/services`);
  }

  OsiPlanAccruals(id) {
    return instance.get(`${CORE_PATH}/Osi/${id}/get-last-plan-or-create-new`);
  }

  OsiServiceCompanies(id) {
    return instance.get(`${CORE_PATH}/Osi/${id}/service-companies`);
  }

  OsiNotSignedActs(id) {
    return instance.get(`${CORE_PATH}/Osi/${id}/not-signed-acts`);
  }

  OsiSignedActs(id) {
    return instance.get(`${CORE_PATH}/Osi/${id}/signed-acts`);
  }

  OsiServiceSaldoByGroups(id) {
    return instance.get(`${CORE_PATH}/Osi/${id}/saldo-by-groups`);
  }

  Act(id) {
    return instance.get(`${CORE_PATH}/Acts/${id}`);
  }

  ActGetDocs(id) {
    return instance.get(`${CORE_PATH}/Acts/${id}/docs`);
  }

  ActUploadDoc(id, payload) {
    return instance.post(`${CORE_PATH}/Acts/${id}/docs`, payload);
  }

  ActDeleteDoc(id, docId) {
    return instance.delete(`${CORE_PATH}/Acts/${id}/docs/${docId}`);
  }

  ActSign(id, data) {
    return instance({
      method: 'PUT',
      url: `${CORE_PATH}/Acts/${id}/sign?extension=pdf`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  ActUnsign(id) {
    return instance.put(`${CORE_PATH}/Acts/${id}/unsign`);
  }

  // Abonents
  Abonent(id) {
    return instance.get(`${CORE_PATH}/Abonents/${id}`);
  }

  AbonentGetOsi(id) {
    return instance.get(`${CORE_PATH}/Abonents/${id}/get-osi`);
  }

  AbonentEdit(id, payload) {
    return instance.put(`${CORE_PATH}/Abonents/${id}`, payload);
  }

  AbonentCreate(payload) {
    return instance.post(`${CORE_PATH}/Abonents`, payload);
  }

  // Accounts
  OsiAccounts(id) {
    return instance.get(`${CORE_PATH}/Osi/${id}/accounts`);
  }

  // Services
  Service(id) {
    return instance.get(`${CORE_PATH}/OsiServices/${id}`);
  }

  ServiceSaldoList(id) {
    return instance.get(`${CORE_PATH}/OsiServices/${id}/saldo`);
  }

  ServiceCreate(payload) {
    return instance.post(`${CORE_PATH}/OsiServices`, payload);
  }

  ServiceUpdate(id, payload) {
    return instance.put(`${CORE_PATH}/OsiServices/${id}`, payload);
  }

  ServiceDelete(id) {
    return instance.delete(`${CORE_PATH}/OsiServices/${id}`);
  }

  // ServiceSaldoList
  ServiceSaldo(id) {
    return instance.get(`${CORE_PATH}/OsiServiceSaldo/${id}`);
  }

  ServiceSaldoCreate(payload) {
    return instance.post(`${CORE_PATH}/OsiServiceSaldo`, payload);
  }

  ServiceSaldoUpdate(id, payload) {
    return instance.put(`${CORE_PATH}/OsiServiceSaldo/${id}`, payload);
  }

  ServiceSaldoDelete(id) {
    return instance.delete(`${CORE_PATH}/OsiServiceSaldo/${id}`);
  }

  // Service group saldo
  ServiceGroupSaldo(id) {
    return instance.get(`${CORE_PATH}/ServiceGroupSaldo/${id}`);
  }

  ServiceGroupSaldoCreate(payload) {
    return instance.post(`${CORE_PATH}/ServiceGroupSaldo`, payload);
  }

  ServiceGroupSaldoUpdate(id, payload) {
    return instance.put(`${CORE_PATH}/ServiceGroupSaldo/${id}`, payload);
  }

  ServiceGroupSaldoDelete(id) {
    return instance.delete(`${CORE_PATH}/ServiceGroupSaldo/${id}`);
  }

  // Accounts
  Account(id) {
    return instance.get(`${CORE_PATH}/OsiAccounts/${id}`);
  }

  AccountCreate(payload) {
    return instance.post(`${CORE_PATH}/OsiAccounts`, payload);
  }

  AccountUpdate(id, payload) {
    return instance.put(`${CORE_PATH}/OsiAccounts/${id}`, payload);
  }

  AccountDelete(id) {
    return instance.delete(`${CORE_PATH}/OsiAccounts/${id}`);
  }

  // PlanAccruals
  PlanAccruals(id) {
    return instance.get(`${CORE_PATH}/PlanAccurals/${id}`);
  }

  PlanServices(id) {
    return instance.get(`${CORE_PATH}/PlanAccurals/${id}/services`);
  }

  PlanAccrualsDelete(id) {
    return instance.delete(`${CORE_PATH}/PlanAccurals/${id}`);
  }

  PlanServicesSetUssiking(id, checked) {
    return instance.put(`${CORE_PATH}/PlanAccurals/${id}/set-ussiking-included?value=${checked}`);
  }

  // OsiServiceCompanies Сервисные компании ОСИ
  // Получить данные сервисной компании ОСИ
  getOsiServiceCompanies(id) {
    return instance.get(`${CORE_PATH}/OsiServiceCompanies/${id}`);
  }

  // Добавить сервисную компанию ОСИ
  createOsiServiceCompany(payload) {
    return instance.post(`${CORE_PATH}/OsiServiceCompanies`, payload);
  }

  // Изменить сервисную компанию ОСИ
  updateOsiServiceCompany(id, payload) {
    return instance.put(`${CORE_PATH}/OsiServiceCompanies/${id}`, payload);
  }

  // Удаление сервисной компании ОСИ
  deleteOsiServiceCompany(id) {
    return instance.delete(`${CORE_PATH}/OsiServiceCompanies/${id}`);
  }

  // PlanAccuralServices
  PlanAccuralService(id) {
    return instance.get(`${CORE_PATH}/PlanAccuralServices/${id}`);
  }

  PlanAccuralServiceCreate(serviceCode, planAccuralId, amount) {
    return instance.post(
      `${CORE_PATH}/PlanAccuralServices/v2?serviceCode=${serviceCode}&planAccuralId=${planAccuralId}&amount=${amount}`,
      null
    );
  }

  PlanAccuralServiceTarifUpdate(id, amount) {
    return instance.put(`${CORE_PATH}/PlanAccuralServices/${id}/amount/${amount}`);
  }

  PlanAccuralServiceDelete(id) {
    return instance.delete(`${CORE_PATH}/PlanAccuralServices/${id}`);
  }

  PlanAccuralServiceAbonents(id) {
    return instance.get(`${CORE_PATH}/PlanAccuralServices/${id}/abonents`);
  }

  PlanAccuralServiceAbonentsUpdate(id, payload) {
    return instance.put(`${CORE_PATH}/PlanAccuralServices/${id}/abonents`, payload);
  }

  PlanAccuralServiceAbonentsPercent(serviceId, abonentId, percent) {
    return instance.put(
      `${CORE_PATH}/PlanAccuralServices/${serviceId}/abonents/${abonentId}/set-accural-percent?accuralPercent=${percent}`,
      null
    );
  }

  // Transactions
  getOsvCurrentMonth(id) {
    return instance.get(`${CORE_PATH}/Transactions/osv-current-month/${id}`);
  }

  getOsvByPeriod(id, dateBegin, dateEnd) {
    return instance.get(`${CORE_PATH}/Transactions/osv/${id}?dateBegin=${dateBegin}&dateEnd=${dateEnd}`);
  }

  getPayments(osiId, dateBegin, dateEnd) {
    return instance.get(`${CORE_PATH}/Transactions/payments/${osiId}?dateBegin=${dateBegin}&dateEnd=${dateEnd}`);
  }

  getFixes(osiId, dateBegin, dateEnd) {
    return instance.get(`${CORE_PATH}/Transactions/fixes/${osiId}?dateBegin=${dateBegin}&dateEnd=${dateEnd}`);
  }

  getOsvOnAllPeriods(id) {
    return instance.get(`${CORE_PATH}/Transactions/saldo-on-all-periods/${id}`);
  }

  getOsvForDebtors(id, dateBegin, dateEnd) {
    return instance.get(`${CORE_PATH}/Transactions/osv-for-debtors/${id}?dateBegin=${dateBegin}&dateEnd=${dateEnd}`);
  }

  getAccrualsByAbonent(abonentId, startDate, endDate) {
    return instance.get(
      `${CORE_PATH}/Transactions/accurals-by-abonent-and-services/${abonentId}?dateBegin=${startDate}&dateEnd=${endDate}`
    );
  }

  PaymentCreate(userId, payload) {
    return instance.post(`${CORE_PATH}/Transactions/payment/internal?userId=${userId}`, payload);
  }

  PaymentCorrectionCreate(userId, payload) {
    return instance.post(`${CORE_PATH}/Transactions/fix/internal?userId=${userId}`, payload);
  }

  // Scans Сканированные документы
  getScanDoc(id) {
    return instance.get(`${CORE_PATH}/Scans/${id}`);
  }

  // Contract
  createContract(data) {
    return instance.post(`${DOC_PATH}/contract`, JSON.stringify(data));
  }

  signContract(id, data) {
    return instance.post(`${DOC_PATH}/contract/${id}/sign`, data);
  }

  signNewContract(id, data) {
    return instance.post(`${DOC_PATH}/contract/osi/${id}/sign`, data);
  }

  getOSVReport(id, dateBegin, dateEnd, forAbonent) {
    return instance.get(
      `${DOC_PATH}/report/osv/${id}?begin=${dateBegin}&end=${dateEnd}${forAbonent ? '&forAbonent=true' : ''}`
    );
  }

  getAbonentOSVReport(osiId, abonentId, flat) {
    return instance.get(`${DOC_PATH}/report/osv/${osiId}/abonent/${abonentId}?flat=${flat}`);
  }

  getPaymentOrdersReport(id, dateBegin, dateEnd) {
    return instance.get(`${DOC_PATH}/report/payments/orders/${id}?begin=${dateBegin}&end=${dateEnd}`);
  }

  getPaymentsReport(id, dateBegin, dateEnd) {
    return instance.get(`${DOC_PATH}/report/payments/${id}?begin=${dateBegin}&end=${dateEnd}`);
  }

  getFixesReport(id, dateBegin, dateEnd) {
    return instance.get(`${DOC_PATH}/report/fixes/${id}?begin=${dateBegin}&end=${dateEnd}`);
  }

  getOsiAbonentsReport(id) {
    return instance.get(`${DOC_PATH}/report/abonents/${id}`);
  }

  getDebtsReport(id, dateBegin, dateEnd) {
    return instance.get(`${DOC_PATH}/report/debts/${id}?begin=${dateBegin}&end=${dateEnd}`);
  }

  getWorkCompletionAct(id) {
    return instance.get(`${DOC_PATH}/act/work-completion/${id}`);
  }

  saveSignedWorkCompletionAct(id, data) {
    return instance.put(`${DOC_PATH}/act/work-completion/${id}/sign?extension=pdf`, data);
  }

  getDebtorNotification(abonentId) {
    return instance.get(`${DOC_PATH}/notification/debetor/${abonentId}`);
  }

  getNotaryNotification(abonentId) {
    return instance.get(`${DOC_PATH}/notification/notary/${abonentId}`);
  }

  getQRInvoicePDF(osiId) {
    return instance.get(`${DOC_PATH}/invoices/qrpage/${osiId}`);
  }

  // Address Registry
  findATS(term) {
    return instance.get(`${EAR_PATH}/search/ats?searchTerm=${term}`);
  }

  findGeonims(id, term) {
    return instance.get(`${EAR_PATH}/search/geonims?topLevelAtsId=${id}&searchTerm=${term}`);
  }

  findBuildings(id, term) {
    return instance.get(`${EAR_PATH}/search/buildings?geonimId=${id}&searchTerm=${term}`);
  }

  findBuildingInfo(id, atsId) {
    // atsId = 68402
    return instance.get(`${EAR_PATH}/search/building?id=${id}&atsId=${atsId}`);
  }

  // PastDebts
  OsiPastDebts(id) {
    return instance.get(`${CORE_PATH}/Osi/${id}/past-debts`);
  }

  PastDebtsByAbonent(abonent, serviceGroupId) {
    return instance.get(`${CORE_PATH}/PastDebts?abonentId=${abonent}&serviceGroupId=${Number(serviceGroupId)}`);
  }

  PastDebtsUpdate(abonentId, serviceGroupId, payload) {
    return instance.post(`${CORE_PATH}/PastDebts?abonentId=${abonentId}&serviceGroupId=${serviceGroupId}`, payload);
  }

  getInvoicesPdf(id) {
    return instance.get(
      `${CORE_PATH}/Reports/invoices-pdf-on-current-date/${id}?isStraightOrder=true&isOnlyResidents=false`,
      {
        responseType: 'blob'
      }
    );
  }

  getPartialInvoices(payload) {
    return instance.post(
      `${CORE_PATH}/Reports/abonents-invoices-pdf-on-current-date?isStraightOrder=true&isOnlyResidents=false`,
      payload,
      {
        responseType: 'blob'
      }
    );
  }

  // osiServices
  CreateOsiService(payload) {
    return instance.post(`${CORE_PATH}/OsiServices`, payload);
  }

  UpdateAbonentsByServiceId(serviceId, payload) {
    return instance.put(`${CORE_PATH}/OsiServices/${serviceId}/abonents`, payload);
  }

  UpdateOsiService(id, payload) {
    return instance.put(`${CORE_PATH}/OsiServices/${id}`, payload);
  }

  ServiceSetState(serviceId, payload) {
    return instance.put(`${CORE_PATH}/OsiServices/${serviceId}/set-state?isActive=${payload}`);
  }

  GetServiceById(id) {
    return instance.get(`${CORE_PATH}/OsiServices/${id}`);
  }

  GetAbonentsByServiceId(id) {
    return instance.get(`${CORE_PATH}/OsiServices/${id}/abonents`);
  }

  OsiPastDebtsV2(osiId) {
    return instance.get(`${CORE_PATH}/Osi/${osiId}/past-debts`);
  }

  CreateArendator(payload) {
    return instance.post(`${CORE_PATH}/Abonents/arendator`, payload);
  }

  GetExternalAbonentsByOsiId(osiId) {
    return instance.get(`${CORE_PATH}/Osi/${osiId}/abonents?onlyExternals=true`);
  }

  GetServicesByAbonentId(osiId, groupId, abonentId) {
    return instance.get(`${CORE_PATH}/Abonents/get-services?osiId=${osiId}&abonentId=${abonentId}&groupId=${groupId}`);
  }

  GetGroupsAndServicesForFixes(osiId) {
    return instance.get(`${CORE_PATH}/Osi/${osiId}/group-and-services-for-fixes`);
  }

  IsNeedSignNewOffer(osiId) {
    return instance.get(`${CORE_PATH}/Osi/${osiId}/is-need-sign-new-offer`);
  }

  GetUnionTypes() {
    return instance.get(`${CORE_PATH}/Catalogs/union-types`);
  }

  GetAccountReportById(id) {
    return instance.get(`${CORE_PATH}/AccountReports/${id}`);
  }

  GetOsiAccountsByOsiId(osiId) {
    return instance.get(`${CORE_PATH}/AccountReports/osi/${osiId}`);
  }

  GetAccountReportPrevMonthStatusByOsiId(osiId) {
    return instance.get(`${CORE_PATH}/AccountReports/osi/${osiId}/prev-month-status`);
  }

  PublishAccountReport(id, monthlyDebt) {
    return instance.put(`${CORE_PATH}/AccountReports/${id}`, monthlyDebt);
  }

  GetAccountReportListByListId(listId) {
    return instance.get(`${CORE_PATH}/AccountReports/list/${listId}`);
  }

  async AttachAccountReportListByListId(listId, listData) {
    return instance.put(`${CORE_PATH}/AccountReports/list/${listId}`, listData, {
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    });
  }

  UpdateAccountReportListDetails(listId, payload) {
    return instance.post(`${CORE_PATH}/AccountReports/list/${listId}/details`, payload);
  }
}

export default new Api();
