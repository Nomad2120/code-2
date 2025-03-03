import { instance } from '@shared/api/config';
import {
  AccountType,
  AccuralMethods,
  AreaType,
  Bank,
  DocType,
  HouseState,
  Knp,
  ServiceCompany,
  ServiceGroup,
  UnionType
} from '@shared/types/dictionaries';
import { CORE_PATH } from '@shared/api/paths';

const MAIN_PATH = 'Catalogs';

const path = `${CORE_PATH}/${MAIN_PATH}`;

export const getAccuralMethods = (): Promise<AccuralMethods[]> => instance.get(`${path}/accural-methods`);
export const getAreaTypes = (): Promise<AreaType[]> => instance.get(`${path}/area-types`);
export const getAccountTypes = (): Promise<AccountType[]> => instance.get(`${path}/account-types`);
export const getBanks = (): Promise<Bank[]> => instance.get(`${path}/banks`);
export const getDocTypes = (): Promise<DocType[]> => instance.get(`${path}/doc-types`);
export const getHouseStates = (): Promise<HouseState[]> => instance.get(`${path}/house-states`);
export const getKnp = (): Promise<Knp[]> => instance.get(`${path}/knp`);
export const getServiceCompanies = (): Promise<ServiceCompany[]> => instance.get(`${path}/service-companies`);
export const getServiceGroups = (): Promise<ServiceGroup[]> => instance.get(`${path}/service-groups`);
export const getUnionTypes = (): Promise<UnionType[]> => instance.get(`${path}/union-types`);
