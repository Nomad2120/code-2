import { makeAutoObservable } from 'mobx';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { getOsiAbonents } from '@shared/api/osi/abonents/get';
import { Abonent } from '@shared/types/osi/abonents';
import { createArendator } from '@shared/api/abonents/arendator/create';
import { formatPhone, reformatPhone } from '@shared/utils/helpers/formatString';

export class SelectArendatorViewModel {
  options: Abonent[] = [];

  isLoading = false;

  isCreateAbonentDialogOpen = false;

  constructor({ controller, abonentForm, osiId }: any) {
    makeAutoObservable(this);
    this._controller = controller;
    this._abonentForm = abonentForm;
    this._osiId = osiId;
  }

  private _controller: any = null;

  get controller() {
    return this._controller;
  }

  set controller(controller: any) {
    this._controller = controller;
  }

  private _osiId: any = null;

  set osiId(value: any) {
    this._osiId = value;
  }

  private _abonentForm: any = null;

  get abonentForm() {
    return this._abonentForm;
  }

  set abonentForm(abonentForm: any) {
    this._abonentForm = abonentForm;
  }

  openCreatingAbonentDialog = () => {
    this._abonentForm?.reset();
    this._abonentForm?.trigger();
    this.isCreateAbonentDialogOpen = true;
    this.abonentForm.reset({ name: this._controller.field.value.inputValue });
    this._controller.field.onChange({ value: '', inputValue: '' });
  };

  cancelCreatingAbonent = () => {
    this.isCreateAbonentDialogOpen = false;
    this.abonentForm.reset();
  };

  submitCreatingAbonent = async (values: any) => {
    try {
      const payload = {
        osiId: this._osiId,
        name: values.name,
        address: values.ars.building.shortPathRus,
        rca: values.ars.building.rca,
        phone: reformatPhone(values.phone),
        idn: values.bin,
        flat: values.flat ?? ''
      };

      const arendator = await createArendator(payload);
      await this.loadOptions(this._osiId);
      const createdArendator = this.options.find((abonent) => abonent.id === arendator.abonentId);
      if (!createdArendator) throw new Error('arendator is undefined');
      this._controller.field.onChange({ value: createdArendator, inputValue: createdArendator.name });
      this.cancelCreatingAbonent();
    } catch (e) {
      logger.error(e);
      if (e instanceof Error) {
        notistackExternal.error();
        return;
      }

      notistackExternal.error(e);
    }
  };

  loadOptions = async (osiId: number) => {
    try {
      this.isLoading = true;
      this.options = await getOsiAbonents(osiId, true);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    } finally {
      this.isLoading = false;
    }
  };
}
