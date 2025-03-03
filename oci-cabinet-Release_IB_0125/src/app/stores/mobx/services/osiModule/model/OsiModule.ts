import { injectable } from 'inversify';
import { makeAutoObservable, when } from 'mobx';
import { initialValues } from '@mobx/services/osiModule/config';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { getOsiDocsById, getOsiInfoById } from '@shared/api/osi';
import { HistoryModule } from '@mobx/services/history';
import api from '@app/api';
import { flow } from 'lodash';
import { isHydrated, makePersistable } from 'mobx-persist-store';
import { RolesModule } from '@mobx/services/roles';

@injectable()
export class OsiModule {
  osiId = initialValues.osiId;

  osiInfo = initialValues.osiInfo;

  osiDocs = initialValues.osiDocs;

  osiMenus = initialValues.osiMenus;

  isLoading = initialValues.isLoading;

  isLockedMenus = initialValues.isLockedMenus;

  constructor(private history: HistoryModule, private rolesModule: RolesModule) {
    makeAutoObservable(this);
    makePersistable(this, { name: 'OsiModuleV2', properties: ['osiId'] });

    when(
      () => isHydrated(this),
      async () => {
        await this.hydrateOsi();
      }
    );
  }

  get menuItems() {
    const getAdaptedActiveOsiMenus = flow([
      Object.entries,
      (arr) => arr.filter(([, menu]: [string, any]) => menu.active),
      (arr) => arr?.map(([, menu]: [string, any]) => menu)
    ]);

    return getAdaptedActiveOsiMenus(this.osiMenus);
  }

  get isWizardFinished() {
    return this.osiInfo?.wizardStep === 'finish';
  }

  get isFreeMode() {
    return this.osiInfo?.registrationType === 'FREE';
  }

  hydrateOsi = async (): Promise<void> => {
    const { location } = window;
    const isOsi = location.pathname.includes('/osi');

    if (!this.osiId || !isOsi) return;

    await this.selectOsi(this.osiId, false);
  };

  selectOsi = async (osiId: number, withRedirect = true): Promise<void> => {
    try {
      if (this.osiId) {
        this.exitOsi();
      }
      this.osiId = osiId;
      await this.loadOsiInfo();
      await this.loadOsiDocs();

      if (!this.osiInfo) throw new Error('osiInfo not found');

      if (this.osiInfo?.wizardStep !== 'finish') {
        if (withRedirect) {
          this.history.goToWizard();
          return;
        }
      }

      await this.loadOsiMenus();

      if (withRedirect) {
        this.history.goToOsiRoot();
      }
    } catch (e: any) {
      if (e instanceof Error) {
        notistackExternal.error(e?.message ?? e);
        logger.error(e);
        return;
      }
      logger.error(e);
      notistackExternal.error(e);
    }
  };

  refreshOsi = async (): Promise<void> => {
    await this.loadOsiInfo();
    await this.loadOsiMenus();
  };

  exitOsi = (): void => {
    this.osiId = initialValues.osiId;
    this.osiInfo = initialValues.osiInfo;
    this.osiMenus = initialValues.osiMenus;
    this.isLoading = initialValues.isLoading;
  };

  loadOsiInfo = async (): Promise<void> => {
    try {
      if (!this.osiId) return;

      this.isLoading = true;
      this.osiInfo = await getOsiInfoById(this.osiId);
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      this.isLoading = false;
    }
  };

  loadOsiDocs = async (): Promise<void> => {
    try {
      if (!this.osiId) return;

      this.isLoading = true;
      this.osiDocs = await getOsiDocsById(this.osiId);
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      this.isLoading = false;
    }
  };

  loadOsiMenus = async (): Promise<void> => {
    try {
      if (!this.osiId) return;
      // TODO: use shared acts api this

      const notSignedActs = (await api.OsiNotSignedActs(this.osiId)) as unknown as any[];

      if (notSignedActs?.length > 0) {
        // all menus allow for admin user
        if (!this.rolesModule.isHasAdminRole) {
          this.activatePartialMenus();
          this.isLockedMenus = true;
          return;
        }
      }

      this.activateAllMenus();
      this.isLockedMenus = false;

      this.isLoading = true;
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  activatePartialMenus = () => {
    this.osiMenus.acts.active = true;
  };

  activateAllMenus = () => {
    this.osiMenus.info.active = true;
    // this.osiMenus.services.active = true;
    this.osiMenus.abonents.active = true;
    this.osiMenus.accurals.active = true;
    this.osiMenus.osv.active = true;
    this.osiMenus.payments.active = true;
    this.osiMenus.acts.active = true;
    this.osiMenus.reports.active = true;
    this.osiMenus.debts.active = true;
    this.osiMenus.invoices.active = true;
  };
}
