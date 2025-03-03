import { autorun, makeAutoObservable, reaction } from 'mobx';
import { injectable } from 'inversify';
import { RegistrationWizardViewModel } from '@widgets/registrationWizard/store/RegistrationWizardViewModel';
import { UseFormReturn } from 'react-hook-form';
import { queryClient } from '@shared/api/reactQuery';
import { getPutApiRegistrationsIdMutationOptions } from '@shared/api/orval/registrations/registrations';
import { NavigateFunction } from 'react-router-dom';
import { formatPhone, reformatPhone } from '@shared/utils/helpers/formatString';
import { RequestsRegistrationRequest } from '@shared/api/orval/models';
import api from '@app/api';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';

export const defaultValues = {
  name: '',
  unionTypeId: '',
  arInfo: {
    city: {},
    street: {},
    building: {}
  }
};

@injectable()
export class RegistrationInfoEditViewModel {
  wizard: RegistrationWizardViewModel | null = null;

  hookForm: UseFormReturn<any> | null = null;

  isValid = false;

  navigate: NavigateFunction | null = null;

  isLoading = false;

  private _mutationCache = queryClient.getMutationCache();

  private _disposeAllReactionsController = new AbortController();

  private _mutation = this._mutationCache.build(queryClient, getPutApiRegistrationsIdMutationOptions());

  constructor() {
    makeAutoObservable(this);

    autorun(
      () => {
        if (!this.wizard) return;

        this.wizard.isNextStepAllowed = this.isValid;
      },
      { signal: this._disposeAllReactionsController.signal }
    );

    autorun(
      async () => {
        if (!this.wizard?.registration || !this.hookForm) return;

        try {
          this.isLoading = true;
          const arInfo = await this.getAddressFieldsInfo();

          const formatted = {
            ...this.wizard.registration,
            phone: formatPhone(this.wizard.registration.phone),
            apartCount: this.wizard.registration.apartCount.toString(),
            unionTypeId: this.wizard.registration.unionTypeId?.toString(),
            arInfo
          };

          this.hookForm.reset(formatted);
        } catch (e) {
          notistackExternal.error();
          logger.error(e);
        } finally {
          this.isLoading = false;
        }
      },
      { signal: this._disposeAllReactionsController.signal }
    );
  }

  cleanup = () => {
    this._disposeAllReactionsController.abort();
  };

  updateRegistration = async (values: any) => {
    if (!this.wizard?.registration?.id) return;

    try {
      this.isLoading = true;
      const payload: RequestsRegistrationRequest = {
        ...values,
        phone: reformatPhone(values.phone),
        apartCount: Number(values.apartCount),
        rca: values.arInfo.building.rca,
        address: values.arInfo.building.shortPathRus,
        addressRegistryId: values.arInfo.building.id,
        atsId: values.arInfo.city.id
      };

      const response = await this._mutation.execute({ id: this.wizard.registration.id, data: payload });

      if (response.code !== 0) throw new Error(response.message ?? 'Ошибка');

      await this.wizard?.nextStep();
    } catch (e) {
      this.isLoading = false;
      if (e instanceof Error) {
        notistackExternal.error(e.message);
      }
      logger.error(e);
    }
  };

  private getAddressFieldsInfo = async () => {
    if (!this.wizard?.registration?.addressRegistryId || !this.wizard.registration.atsId) return null;

    const address = (await queryClient.fetchQuery({
      queryKey: [
        'findBuildingInfo',
        {
          addressRegistryId: this.wizard.registration.addressRegistryId,
          atsId: this.wizard.registration.atsId
        }
      ],
      queryFn: () =>
        api.findBuildingInfo(this.wizard?.registration?.addressRegistryId, this.wizard?.registration?.atsId)
    })) as any;

    const arInfo = {
      city: address.ats,
      street: address.geonim,
      building: Object.fromEntries(Object.entries(address).filter(([key, value]) => key !== 'ats' && key !== 'geonim'))
    };

    return arInfo;
  };
}
