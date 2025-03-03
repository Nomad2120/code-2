import { IRegistrationSignViewModel } from '@shared/types/mobx/RegistrationSignViewModel';
import { autorun, makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { base64Decode } from '@shared/utils/helpers/base64Convertion';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { RegistrationWizardViewModel } from '@widgets/registrationWizard/store/RegistrationWizardViewModel';
import { ProfileModule } from '@mobx/services/profile';
import { RegistrationSignModel } from '@entities/registration/RegistrationSignForm/model/RegistrationSignModel';

@injectable()
export class RegistrationSignViewModel implements IRegistrationSignViewModel {
  elements: { docHtml: any; docPdf: any } = {
    docHtml: null,
    docPdf: null
  };

  isLoading = false;

  wizard: RegistrationWizardViewModel | null = null;

  constructor(private _model: RegistrationSignModel, private _profileModule: ProfileModule) {
    makeAutoObservable(this);

    autorun(async () => {
      if (!this.wizard) return;

      await this.createContract();
    });
  }

  createContract = async (): Promise<void> => {
    try {
      if (!this.wizard?.registration) return;

      this.isLoading = true;
      const { registration } = this.wizard;
      const user = this._profileModule.userData;
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

      const data = (await this._model.createContract(payload)) as unknown as { htmlBase64: any; pdfBase64: any };

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
      if (!this.wizard?.registration) return;
      this.isLoading = true;

      const regId = this.wizard.registration.id;

      if (!regId) return;
      await this._model.signContract(regId, data);
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
