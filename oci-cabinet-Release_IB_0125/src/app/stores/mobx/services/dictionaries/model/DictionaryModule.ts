import { injectable } from 'inversify';
import { autorun, makeAutoObservable } from 'mobx';
import {
  getAccountTypes,
  getAccuralMethods,
  getAreaTypes,
  getBanks,
  getDocTypes,
  getHouseStates,
  getKnp,
  getServiceCompanies,
  getServiceGroups,
  getUnionTypes
} from '@shared/api/dictionaries';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
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
import { getValuesByKeys } from '@shared/api/keyValues';
import { links } from '@shared/instructions/config';
import { AuthModule } from '@mobx/services/auth';

@injectable()
export class DictionaryModule {
  accountTypes: AccountType[] = [];

  accuralMethods: AccuralMethods[] = [];

  areaTypes: AreaType[] = [];

  banks: Bank[] = [];

  docTypes: DocType[] = [];

  houseStates: HouseState[] = [];

  knp: Knp[] = [];

  serviceCompanies: ServiceCompany[] = [];

  serviceGroups: ServiceGroup[] = [];

  unionTypes: UnionType[] = [];

  instructionLinks: Record<string, string> = {};

  isCatalogLoaded = false;

  constructor(private authModule: AuthModule) {
    makeAutoObservable(this);

    this.loadInstructionLinks();

    autorun(() => {
      if (this.authModule.userData?.id) {
        this.loadDictionaries();
      }
    });
  }

  loadDictionaries = async (): Promise<void> => {
    // account
    try {
      this.accountTypes = await getAccountTypes();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }

    // accural
    try {
      this.accuralMethods = await getAccuralMethods();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }

    // area
    try {
      this.areaTypes = await getAreaTypes();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }

    // banks
    try {
      this.banks = await getBanks();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }

    // docTypes
    try {
      this.docTypes = await getDocTypes();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }

    // houseStates
    try {
      this.houseStates = await getHouseStates();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }

    // knp
    try {
      this.knp = await getKnp();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }

    // serviceCompanies
    try {
      this.serviceCompanies = await getServiceCompanies();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }

    // serviceGroups
    try {
      this.serviceGroups = await getServiceGroups();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }

    // unionTypes
    try {
      this.unionTypes = await getUnionTypes();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  loadInstructionLinks = async () => {
    try {
      this.instructionLinks = await this.getInstructionLinks();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  getInstructionLinks = () => {
    const keys = Object.keys(links);

    return getValuesByKeys(keys);
  };
}
