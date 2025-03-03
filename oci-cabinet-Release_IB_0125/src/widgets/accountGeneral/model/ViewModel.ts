import { IAccountGeneralWidgetViewModel } from '@shared/types/mobx/widgets/AccountGeneral';
import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { get, isEmpty, replace } from 'lodash';
import api from '@app/api';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { ProfileModule } from '@mobx/services/profile';

@injectable()
export class AccountGeneralWidgetViewModel implements IAccountGeneralWidgetViewModel {
  isLoading = false;

  constructor(private profileModule: ProfileModule) {
    makeAutoObservable(this);
  }

  get user() {
    return this.profileModule.userData.info;
  }

  onSubmit = async (values: any, formikState: any) => {
    const payload = { ...values };
    const { setSubmitting, setErrors } = formikState;
    payload.phone = replace(replace(payload.phone, '+7 7', '7'), new RegExp(' ', 'g'), '');
    try {
      this.isLoading = true;
      await api.UsersChangeInfo(this.profileModule.userData.id, payload);
      notistackExternal.success('common:dataSaved');

      this.profileModule.refreshUserInfo();
    } catch (err: any) {
      const errors = get(err, ['response', 'data', 'errors']);
      if (isEmpty(errors)) {
        setErrors({ afterSubmit: err.toString() });
        notistackExternal.error();
        setSubmitting(false);
      } else {
        const formikErrors: any = {};
        Object.keys(errors).forEach((key) => {
          formikErrors[key.toLowerCase()] = errors[key];
        });
        setErrors({ ...formikErrors });
        setSubmitting(false);
      }
    } finally {
      this.isLoading = false;
    }
  };
}
