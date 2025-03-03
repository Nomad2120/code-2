import { HookForm, OsiInfoWidgetViewModel } from '@shared/types/mobx/widgets/OsiInfoWidget';
import { injectable } from 'inversify';
import { OsiModule } from '@mobx/services/osiModule';
import { DictionaryModule } from '@mobx/services/dictionaries/model/DictionaryModule';
import { autorun, makeAutoObservable } from 'mobx';
import { get as _get, clone as _clone, isEmpty } from 'lodash';
import { formatPhone, reformatPhone } from '@shared/utils/helpers/formatString';
import { mockHouseStateCode } from '@shared/constants/houseStateCode';
import api from '@app/api';
import NotistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';
import { OsiInfoValues } from '@shared/types/osi';
import { RolesModule } from '@mobx/services/roles';
import { initialFormValues } from '../config';

@injectable()
export class ViewModel implements OsiInfoWidgetViewModel {
  formValues = initialFormValues;

  hookForm: HookForm = null;

  constructor(
    private osiModule: OsiModule,
    private dictionaryModule: DictionaryModule,
    private rolesModule: RolesModule
  ) {
    makeAutoObservable(this);

    autorun(() => {
      this.fillFormValues();
    });
  }

  get houseStates() {
    return this.dictionaryModule.houseStates;
  }

  get lockedFields() {
    const hasRoles = this.rolesModule.isHasAdminRole || this.rolesModule.isHasOperatorRole;

    return !hasRoles ? ['name', 'idn', 'fio', 'floors'] : [];
  }

  get docs() {
    return this.osiModule.osiDocs || [];
  }

  get osiUnionTypeName() {
    return {
      Ru: this.osiModule.osiInfo?.unionTypeRu ?? '',
      Kz: this.osiModule.osiInfo?.unionTypeKz ?? ''
    };
  }

  fillFormValues = () => {
    if (!this.osiModule.osiInfo) return;

    // set values from osi info
    const formKeys = Object.keys(this.formValues);

    formKeys.forEach((key) => {
      if (key === 'phone') {
        (this.formValues[key as keyof OsiInfoValues] as any) = formatPhone(this.osiModule.osiInfo?.[key]);
        return;
      }

      if (key === 'constructionMaterial' || key === 'constructionYear') {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (this.formValues[key as keyof OsiInfoValues] as any) = String(this.osiModule.osiInfo?.[key]) ?? '';
    });

    this.hookForm?.reset(this.formValues);
    this.hookForm?.trigger();
  };

  setHookForm = (hookForm: HookForm) => {
    this.hookForm = hookForm;
  };

  submitForm = async (data: any) => {
    const payload = _clone(data);
    payload.phone = reformatPhone(payload.phone);
    payload.floors = !payload.floors ? 0 : parseInt(payload.floors, 10);
    // TODO: need to remove houseStateCode from endpoint
    payload.houseStateCode = mockHouseStateCode;
    // TODO: get all info from osi module
    payload.address = this.osiModule.osiInfo?.address;
    payload.coefUnlivingArea = this.osiModule.osiInfo?.coefUnlivingArea;
    payload.wreckage = false;
    payload.unionTypeId = this.osiModule.osiInfo?.unionTypeId;

    payload.personalHeating = null;
    payload.personalHotWater = null;
    payload.personalElectricPower = null;
    payload.gasified = null;

    try {
      await api.OsiUpdate(this.osiModule.osiInfo?.id, payload);
      // await this.osiModule.loadOsiInfo();
      NotistackExternal.success('common:saved');
    } catch (err: any) {
      const errors = _get(err, ['response', 'data', 'errors']);
      if (isEmpty(errors)) {
        NotistackExternal.error(err.toString());
      }
      logger.error(errors);
    }
  };
}
