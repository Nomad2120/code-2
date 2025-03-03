import { injectable } from 'inversify';
import { autorun, makeAutoObservable } from 'mobx';
import { RegistrationModule } from '@mobx/services/registration';
import { formatPhone } from '@shared/utils/helpers/formatString';
import { replace as _replace } from 'lodash';
import { RegistrationEditPayload, RegistrationFormModel } from '@entities/registration/RegistrationForm/model/model';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { SettingsStore } from '@mobx/services/SettingsStore';
import { tokens } from '@shared/utils/i18n';

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
export class RegistrationFormEditViewModel {
  formik: any;

  unionTypes: any;

  isLoading = false;

  initialValues: RegistrationFormValues = {
    name: '',
    fio: '',
    idn: '',
    phone: '',
    email: '',
    apartCount: undefined,
    unionTypeId: '-1',
    arInfo: {
      ats: '',
      geonim: '',
      building: ''
    }
  };

  constructor(
    private model: RegistrationFormModel,
    private registrationModule: RegistrationModule,
    private settingsStore: SettingsStore
  ) {
    makeAutoObservable(this);

    autorun(() => {
      this.isLoading = true;
      const { selectedRegistration } = registrationModule;
      this.initialValues.name = selectedRegistration?.name;
      this.initialValues.fio = selectedRegistration?.fio;
      this.initialValues.idn = selectedRegistration?.idn;
      this.initialValues.phone = formatPhone(selectedRegistration?.phone);
      this.initialValues.email = selectedRegistration?.email;
      this.initialValues.apartCount = selectedRegistration?.apartCount.toString();
      this.initialValues.unionTypeId = selectedRegistration?.unionTypeId.toString();
      this.initialValues.arInfo.ats = selectedRegistration?.arInfo.ats;
      this.initialValues.arInfo.geonim = selectedRegistration?.arInfo.geonim;
      this.initialValues.arInfo.building = selectedRegistration?.arInfo.building;

      this.isLoading = false;
    });

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
    const payload = {} as RegistrationEditPayload;
    const { selectedRegistration } = this.registrationModule;

    if (!selectedRegistration?.userId || !selectedRegistration?.id) {
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
    payload.userId = selectedRegistration?.userId;
    payload.id = selectedRegistration?.id;

    try {
      await this.model.updateRegistration(payload);
      await this.registrationModule.loadAllRegistrations();
      this.registrationModule.selectRegistration(payload.id);
      notistackExternal.success();
    } catch (e) {
      notistackExternal.error(e);
    }
  };
}
