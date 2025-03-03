import { autorun, makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { RegistrationWizardViewModel } from '@widgets/registrationWizard/store/RegistrationWizardViewModel';
import { UseFormReturn } from 'react-hook-form';
import { queryClient } from '@shared/api/reactQuery';
import {
  getGetApiRegistrationsIdQueryOptions,
  getPostApiRegistrationsMutationOptions
} from '@shared/api/orval/registrations/registrations';
import { NavigateFunction } from 'react-router-dom';
import { PATH_CABINET } from '@app/routes/paths';
import { RequestsRegistrationRequest } from '@shared/api/orval/models';
import { reformatPhone } from '@shared/utils/helpers/formatString';
import { ProfileModule } from '@mobx/services/profile';

const defaultValues = {
  fio: '',
  name: '',
  idn: '',
  phone: '',
  email: '',
  apartCount: '',
  unionTypeId: '',
  arInfo: {
    city: '',
    street: '',
    building: ''
  }
};

@injectable()
export class RegistrationInfoCreateViewModel {
  wizard: RegistrationWizardViewModel | null = null;

  hookForm: UseFormReturn<NonNullable<unknown>, any, undefined> | null = null;

  isValid = false;

  defaultValues = defaultValues;

  navigate: NavigateFunction | null = null;

  private _mutationCache = queryClient.getMutationCache();

  constructor(private _profileModule: ProfileModule) {
    makeAutoObservable(this);

    autorun(() => {
      if (!this.wizard) return;

      this.wizard.isNextStepAllowed = this.isValid;
    });
  }

  createRegistration = async (values: any) => {
    const createRegistrationMutation = this._mutationCache.build(queryClient, getPostApiRegistrationsMutationOptions());

    const { arInfo, ...rawPayload } = values;

    const payload: RequestsRegistrationRequest = {
      ...rawPayload,
      registrationType: 'FULL',
      unionTypeId: Number(values.unionTypeId),
      apartCount: Number(values.apartCount),
      phone: reformatPhone(values.phone),
      rca: values.arInfo.building.rca,
      address: values.arInfo.building.shortPathRus,
      addressRegistryId: values.arInfo.building.id,
      atsId: values.arInfo.city.id,
      email: values.email ?? '',
      userId: this._profileModule.userData.id
    };

    const response = await createRegistrationMutation.execute({ data: payload });

    if (!response?.result) return;
    const registrationId = response.result;

    await queryClient.fetchQuery(getGetApiRegistrationsIdQueryOptions(registrationId));
    if (!this.navigate) return;

    this.navigate(PATH_CABINET.registration, { state: { registrationId } });
    // TODO: бэкенд не успевает обновить шаг (ошибка заявка не найдена)
    setTimeout(async () => {
      await this.wizard?.nextStep();
    }, 200);
  };
}
