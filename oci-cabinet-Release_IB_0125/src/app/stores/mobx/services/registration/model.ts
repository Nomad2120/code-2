import { makeAutoObservable } from 'mobx';
import { injectable } from 'inversify';
import { Registration, RegistrationDoc } from '@mobx/interfaces';
import api from '@app/api';
import { getRequiredDocsByRegistrationId } from '@shared/api/registration';
import { RequiredDocsResponse } from '@shared/types/registration';

@injectable()
export class RegistrationModel {
  constructor() {
    makeAutoObservable(this);
  }

  getUserRegistrations = async (userId: number | null): Promise<Registration[]> =>
    (await api.UsersRegistrations(userId)) as unknown as Registration[];

  getReqDocs = async (regId: number): Promise<RequiredDocsResponse[]> =>
    (await getRequiredDocsByRegistrationId(regId)) as unknown as RequiredDocsResponse[];

  getRegistrationDocs = async (registrationId: number): Promise<RegistrationDoc[]> =>
    (await api.RegistrationDocs(registrationId)) as unknown as RegistrationDoc[];

  getArInfo = async (addressId: number, atsId: number): Promise<any> =>
    (await api.findBuildingInfo(addressId, atsId)) as any;

  getUnionTypes = async () => api.GetUnionTypes();
}
