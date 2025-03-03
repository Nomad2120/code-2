import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { RegistrationModule } from '@mobx/services/registration';
import { RegistrationSignModel } from '@entities/registration/RegistrationSignForm/model/RegistrationSignModel';
import { ProfileModule } from '@mobx/services/profile';
import { base64Decode } from '@shared/utils/helpers/base64Convertion';
import notistackExternal from '@shared/utils/helpers/notistackExternal';

@injectable()
export class RegistrationSignViewModel {
  isLoading = false;

  elements: { docHtml: any; docPdf: any } = {
    docHtml: null,
    docPdf: null
  };

  constructor(
    private model: RegistrationSignModel,
    private registrationModule: RegistrationModule,
    private profileModule: ProfileModule
  ) {
    makeAutoObservable(this);
  }

  createContract = async () => {
    try {
      this.isLoading = true;
      const registration = this.registrationModule.selectedRegistration;
      const user = this.profileModule.userData;
      if (!registration || !user.info) return;

      const payload = {
        id: registration.id,
        address: registration.address,
        apartCount: registration.apartCount,
        createDt: registration.createDt,
        email: registration.email,
        idn: registration.idn,
        name: registration.name,
        phone: registration.phone,
        fio: user.info.fio,
        tariff: registration.tariff
      };

      const data = (await this.model.createContract(payload)) as unknown as { htmlBase64: any; pdfBase64: any };

      this.elements.docHtml = base64Decode(data?.htmlBase64);
      this.elements.docPdf = data?.pdfBase64;
    } catch (e) {
      console.error(e);
      notistackExternal.error('common:contractError');
    } finally {
      this.isLoading = false;
    }
  };

  saveContract = async (data: any): Promise<void> => {
    try {
      this.isLoading = true;

      if (!this.registrationModule.selectedRegistration) return;

      const regId = this.registrationModule.selectedRegistration.id;

      await this.model.signContract(regId, data);
      notistackExternal.success();
    } catch (e) {
      console.error(e);
      notistackExternal.error('common:contractSignError');
      throw e;
    } finally {
      this.isLoading = false;
    }
  };
}
