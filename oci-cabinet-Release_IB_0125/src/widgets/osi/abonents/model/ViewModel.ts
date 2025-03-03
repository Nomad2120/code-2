import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { IOsiAbonentsWidgetViewModel } from '@shared/types/mobx/widgets/OsiAbonentsWidget';
import { Abonent } from '@shared/types/osi/abonents';
import { getOsiAbonents } from '@shared/api/osi/abonents/get';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { OsiModule } from '@mobx/services/osiModule';
import { getOsiAbonentsReport } from '@shared/api/osi/abonents/report';
import flatComparator from '@shared/utils/helpers/flatComparator';
import _, { sumBy } from 'lodash';
import { DictionaryModule } from '@mobx/services/dictionaries/model/DictionaryModule';
import { v4 as uuid4 } from 'uuid';
import { getBase64 } from '@shared/utils/helpers/base64Convertion';
import { loadAbonentsFromExcel } from '@shared/api/osi';

@injectable()
export class OsiAbonentsWidgetViewModel implements IOsiAbonentsWidgetViewModel {
  abonents: Abonent[] = [];

  isLoading = false;

  isCreatingDialogOpen = false;

  isEditingDialogOpen = false;

  temporaryRow: any = {};

  constructor(private osiModule: OsiModule, private dictionary: DictionaryModule) {
    makeAutoObservable(this);
    void this.loadAbonents();
  }

  private _reloadCb = async () => {
    await this.loadAbonents();
  };

  get reloadCb() {
    return this._reloadCb;
  }

  get sortedAbonents() {
    const usualAbonents = this.abonents
      .filter((abonent) => !abonent.external)
      .sort((a, b) => {
        // @ts-expect-error-next-line отслеживаю isNew и не хочу расширять тип
        if (a.isNew) {
          return 1;
        }

        return flatComparator(a?.flat, b?.flat);
      });
    const externalAbonents = this.abonents
      .filter((abonent) => abonent.external)
      .sort((a, b) => flatComparator(a?.flat, b?.flat));

    return [...usualAbonents, ...externalAbonents];
  }

  get totalAbonents() {
    return this.abonents.length;
  }

  get totalSquare() {
    return sumBy(this.abonents, 'square').toFixed(2);
  }

  get totalParkingPlaces() {
    return sumBy(this.abonents, 'parkingPlaces');
  }

  get osiId() {
    return this.osiModule.osiId;
  }

  get areaTypes() {
    return this.dictionary.areaTypes;
  }

  downloadReport = async () => {
    try {
      if (!this.osiModule.osiId || !this.osiModule.osiInfo?.name) throw new Error('osiId is undefined');
      this.isLoading = true;
      const data = await getOsiAbonentsReport(this.osiModule.osiId);
      const fetchData = `data:application/xlsx;base64,${data}`;
      const a = document.createElement('a');
      a.href = fetchData;

      const house = this.osiModule.osiInfo?.address
        ?.split(',')
        .slice(-1)
        .pop()
        ?.replace('д.', '')
        .replace('дом', '')
        .trim();
      const osiName = this.osiModule.osiInfo?.name.startsWith(this.osiModule.osiInfo?.unionTypeRu ?? '')
        ? this.osiModule.osiInfo?.name
        : `${this.osiModule.osiInfo?.unionTypeRu} ${this.osiModule.osiInfo?.name}`;
      a.download = `Помещения(квартиры)_${osiName}_дом_${house}_${new Date().toISOString().substring(0, 10)}.xlsx`;
      a.click();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };

  startCreatingAbonent = () => {
    this.isCreatingDialogOpen = true;
  };

  stopCreatingAbonent = () => {
    this.isCreatingDialogOpen = false;
  };

  startEditingAbonent = () => {
    this.isEditingDialogOpen = true;
  };

  stopEditingAbonent = () => {
    this.isEditingDialogOpen = false;
  };

  updateAbonent = (updated: Abonent) => {
    const oldAbonent = this.abonents.find((abonent) => abonent.id === updated.id);

    if (!oldAbonent) return;
    Object.assign(oldAbonent, updated);
  };

  addAbonent = () => {
    const id = uuid4();

    const flat = this.calculateNextFlat();

    this.abonents.push({ id, flat, external: false, isNew: true, ...this.temporaryRow });
    return id;
  };

  calculateNextFlat = () => {
    const existingFlats = this.abonents
      .filter((abonent) => !abonent.external)
      .map((abonent) => abonent.flat)
      .sort((a, b) => flatComparator(a, b));
    const lastFlat = parseInt(existingFlats.slice(-1)[0], 10);

    if (!lastFlat) return (this.totalAbonents + 1).toString();

    return (lastFlat + 1).toString();
  };

  cancelCreating = () => {
    // @ts-expect-error-next-line отслеживаю isNew и не хочу расширять тип
    _.remove(this.abonents, (abonent) => abonent.isNew);
  };

  saveTemporaryRow = (temporaryRow: any) => {
    const { id, flat, ...tempRow } = temporaryRow;
    this.temporaryRow = tempRow;
  };

  clearTemporaryRow = () => {
    this.temporaryRow = {};
  };

  importAbonents = async (file: File) => {
    try {
      if (!this.osiId) throw new Error('OsiId is undefined');
      this.isLoading = true;
      const b64 = await getBase64(file);
      await loadAbonentsFromExcel(this.osiId, b64.bytes);
      await this.loadAbonents();
      notistackExternal.success();
    } catch (e) {
      logger.error(e);
      notistackExternal.error(e);
    } finally {
      this.isLoading = false;
    }
  };

  private loadAbonents = async () => {
    try {
      if (!this.osiModule.osiId) throw new Error('osiId is undefined');
      this.isLoading = true;
      this.abonents = await getOsiAbonents(this.osiModule.osiId);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };
}
