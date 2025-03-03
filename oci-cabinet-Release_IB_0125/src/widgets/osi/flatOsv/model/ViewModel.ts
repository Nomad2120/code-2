import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { IOsiFlatOsvWidgetViewModel } from '@shared/types/mobx/widgets/OsiFlatOsvWidget';
import { OsiModule } from '@mobx/services/osiModule';
import api from '@app/api';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import makeFlat from '@shared/utils/helpers/makeFlat';
import { getOsiAbonents } from '@shared/api/osi/abonents/get';
import { Abonent } from '@shared/types/osi/abonents';
import { getOsvRowsByFlat } from '@shared/utils/helpers/osv';
import { SettingsStore } from '@mobx/services/SettingsStore';

@injectable()
export class OsiFlatOsvWidgetViewModel implements IOsiFlatOsvWidgetViewModel {
  abonents: Abonent[] = [];

  isLoading = false;

  periodsNumber = 0;

  rows: any[] = [];

  selectedAbonent: Abonent | null = null;

  totalsOsv: any[] = [];

  constructor(private osiModule: OsiModule, private settingsStore: SettingsStore) {
    makeAutoObservable(this);
    this.loadAbonents();
  }

  downloadOsv = async (): Promise<void> => {
    try {
      if (!this.osiModule.osiId || !this.selectedAbonent?.id) throw new Error('osiId or abonentId is undefined');

      this.isLoading = true;

      const data = await api.getAbonentOSVReport(
        this.osiModule.osiId,
        this.selectedAbonent.id,
        this.selectedAbonent?.flat
      );
      const fetchData = `data:application/xlsx;base64,${data}`;
      const a = document.createElement('a');
      a.href = fetchData;
      const osiName = this.osiModule.osiInfo?.name.startsWith(this.osiModule.osiInfo?.unionTypeRu ?? '')
        ? this.osiModule.osiInfo?.name
        : `${this.osiModule.osiInfo?.unionTypeRu} ${this.osiModule.osiInfo?.name}`;
      a.download = `Оборотно_сальдовая_ведомость_${osiName}_по_помещению_${this.selectedAbonent?.flat}.xlsx`;
      a.click();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  loadAbonents = async (): Promise<void> => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');

      this.isLoading = true;
      const data = await getOsiAbonents(this.osiModule.osiId);

      const allAbonents = data.map((abonent) => {
        if (abonent.external) {
          return { ...abonent, flat: `Аренда(${abonent.name})` };
        }
        return abonent;
      });

      this.abonents = allAbonents.map((e) => ({ ...e, flat: makeFlat(e) }));
      this.selectedAbonent = data?.length ? data[0] : null;
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  loadOsv = async (): Promise<void> => {
    try {
      if (!this.osiModule.osiId || !this.selectedAbonent?.id) throw new Error('osiId or abonentId is undefined');

      this.isLoading = true;

      const data = await api.getOsvOnAllPeriods(this.selectedAbonent.id);
      const [rows, total] = getOsvRowsByFlat(data, this.settingsStore.moment);
      // @ts-expect-error api not typed
      this.periodsNumber = data.length;
      this.rows = rows;
      this.totalsOsv = total;
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };
}
