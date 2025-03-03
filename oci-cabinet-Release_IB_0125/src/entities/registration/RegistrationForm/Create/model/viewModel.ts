import { injectable } from 'inversify';
import { autorun, makeAutoObservable } from 'mobx';
import { RegistrationModule } from '@mobx/services/registration';
import { replace as _replace } from 'lodash';
import { RegistrationCreatePayload, RegistrationFormModel } from '@entities/registration/RegistrationForm/model/model';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { SettingsStore } from '@mobx/services/SettingsStore';
import { tokens } from '@shared/utils/i18n';
import { AuthModule } from '@mobx/services/auth';

interface RegistrationFormValues {
  name: string | undefined;
  fio: string | undefined;
  idn: string | undefined;
  phone: string | undefined;
  email: string | undefined;
  apartCount: string | undefined;
  unionTypeId: string | undefined;
  arInfo: any;
}

@injectable()
export class RegistrationFormCreateViewModel {
  formik: any;

  unionTypes: any;

  initialValues: RegistrationFormValues = {
    name: '',
    fio: '',
    idn: '',
    phone: '',
    email: '',
    apartCount: undefined,
    unionTypeId: undefined,
    arInfo: {
      ats: '',
      geonim: '',
      building: ''
    }
  };

  constructor(
    private model: RegistrationFormModel,
    private registrationModule: RegistrationModule,
    private settingsStore: SettingsStore,
    private authModule: AuthModule
  ) {
    makeAutoObservable(this);

    autorun(() => {
      if (!this.registrationModule.unionTypes) {
        this.registrationModule.loadUnionTypes();
        return;
      }

      this.unionTypes = this.registrationModule.unionTypes;
    });
  }

  syncFormik = (formik: any) => {
    this.formik = formik;
  };

  submit = async (values: RegistrationFormValues) => {
    const payload = {} as RegistrationCreatePayload;

    if (!this.authModule.id) {
      notistackExternal.error('common:noUser');
      return;
    }

    if (!values.apartCount || !values.fio || !values.idn || !values.name || !values.unionTypeId || !values.phone) {
      notistackExternal.error('common:notFullDataError');
      return;
    }

    payload.apartCount = Number(values.apartCount);
    payload.email = values.email;
    payload.fio = values.fio;
    payload.idn = values.idn;
    payload.name = values.name;
    payload.unionTypeId = Number(values.unionTypeId);
    payload.phone = _replace(_replace(values.phone, '+7 7', '7'), new RegExp(' ', 'g'), '');
    payload.addressRegistryId = values.arInfo.building.id;
    payload.atsId = values.arInfo.ats.id;
    payload.rca = values.arInfo.building.rca;
    payload.address = values.arInfo.building.shortPathRus;
    payload.userId = this.authModule.id;

    try {
      const id = await this.model.createRegistration(payload);
      notistackExternal.success();
      await this.registrationModule.loadAllRegistrations();
      await this.registrationModule.selectRegistration(id);
    } catch (e) {
      notistackExternal.error(e);
    }
  };
}
