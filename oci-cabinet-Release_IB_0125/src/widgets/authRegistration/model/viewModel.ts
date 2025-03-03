import { makeAutoObservable, when } from 'mobx';
import { injectable } from 'inversify';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';
import { FormikHelpers } from 'formik';
import { changeUserInfo, checkContact, generateOtp } from '@shared/api/authRegistration';
import { HistoryModule } from '@mobx/services/history';
import { SubmitHandler } from 'react-hook-form';
import { UserInfo } from '@widgets/authRegistration/config/validation';
import { formatPhone, reformatPhone } from '@shared/utils/helpers/formatString';
import { AuthModule } from '@mobx/services/auth';
import { RolesModule } from '@mobx/services/roles';
import { UserRoles } from '@mobx/interfaces';
import { clearPersistedStore, isHydrated, makePersistable } from 'mobx-persist-store';
import { NavigateFunction } from 'react-router-dom';
import { PATH_AUTH } from '@app/routes/paths';
import { TimerState } from '@widgets/authRegistration/model/timerState';

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

export enum WidgetStates {
  phone = 'phone',
  confirmPhone = 'confirmPhone',
  verifyCode = 'verifyCode',
  changePassword = 'changePassword',
  userInfo = 'userInfo'
}

const wsUrl = `${apiUrl?.replace('http', 'ws')}/ws`;

@injectable()
export class RegistrationWidgetViewModel {
  state: WidgetStates = WidgetStates.confirmPhone;

  socket: WebSocket;

  botUrl = 'http://t.me/OSITelegramBot';

  phone = '';

  userId: number | null = null;

  timerState: any;

  selectedVerifyMethod: 'SMS' | 'Telegram' = 'Telegram';

  constructor(
    private history: HistoryModule,
    private authModule: AuthModule,
    private rolesModule: RolesModule,
    timerState: TimerState
  ) {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'RegistrationWidgetViewModel',
      properties: ['state', 'botUrl', 'phone', 'userId']
    });
    this.timerState = timerState;

    this.socket = new WebSocket(wsUrl);

    this.socket.onmessage = (msg) => {
      if (msg.data === 'success') {
        this.goToVerifyCode();
      }
    };

    when(
      () => isHydrated(this),
      async () => {
        if (window.history.state?.usr?.isFreshRegistration) {
          await this.clearRegistrationStore();
        }
      }
    );
  }

  clearRegistrationStore = async () => {
    await clearPersistedStore(this);
    this.cancelRegistration();
    if (window.history.state?.usr?.phone) {
      this.phone = formatPhone(window.history.state.usr?.phone);
    }
    // eslint-disable-next-line no-restricted-globals
    window.history.replaceState(window.history.state, '');
  };

  startWaitingSocket = (phone: string) => {
    this.sendMessage({
      name: 'wait_end_registration',
      data: {
        phone
      }
    });
  };

  stopWaitingSocket = () => {
    this.sendMessage({
      name: 'stop_wait_end_registration'
    });
  };

  sendMessage = (message: { name?: string; data?: any }) => {
    if (!this.socket?.readyState) return;

    if (this.socket?.readyState === WebSocket.CLOSED) return;

    this.socket.send(JSON.stringify(message));
  };

  checkContactPhone = async (
    phoneValue: string,
    helpers: FormikHelpers<{
      phone: string;
      afterSubmit?: string;
    }>,
    navigate: NavigateFunction
  ) => {
    try {
      const phone = reformatPhone(phoneValue);

      const resp = await checkContact(phone);
      if (!resp) throw new Error('Network error');

      const { isContacted, isRegistered, hasPassword, botUrl } = resp;

      if (isRegistered && hasPassword) {
        navigate(PATH_AUTH.login, { state: { phone } });
        throw new Error('Пользователь уже зарегистрирован');
      }

      if (botUrl) this.botUrl = botUrl;

      if (!isContacted && !botUrl) this.botUrl = 'http://t.me/OSITelegramBot';

      if (isContacted && !hasPassword) void generateOtp(phone);

      this.phone = phone;

      this.startWaitingSocket(phone);
      this.selectedVerifyMethod = 'Telegram';
      this.goToConfirmPhone();
    } catch (e) {
      logger.error(e);
      if (e instanceof Error) {
        helpers.setErrors({ afterSubmit: e.toString() });
      } else {
        notistackExternal.error();
      }
    } finally {
      helpers.setSubmitting(false);
    }
  };

  goToConfirmPhone = () => {
    this.state = WidgetStates.confirmPhone;
  };

  goToVerifyCode = () => {
    this.state = WidgetStates.verifyCode;
  };

  goToPhoneForm = () => {
    this.state = WidgetStates.phone;
  };

  goToChangePassword = () => {
    this.state = WidgetStates.changePassword;
  };

  goToUserInfo = () => {
    this.state = WidgetStates.userInfo;
  };

  setUserId = (userId: number | null) => {
    this.userId = userId;
  };

  onSuccessVerifyCode = (userId: number | null) => {
    this.userId = userId;
    this.goToChangePassword();
  };

  cancelRegistration = () => {
    this.goToConfirmPhone();
  };

  returnToLogin = () => {
    const phone = reformatPhone(this.phone);
    this.history.navigateTo(PATH_AUTH.login, { state: { phone } });
  };

  onPasswordChanged = () => {
    this.goToUserInfo();
  };

  onUserInfoSubmit: SubmitHandler<UserInfo> = async (values) => {
    try {
      if (!this.userId) return;

      const payload = {
        fio: values.fio,
        phone: reformatPhone(values.phone)
      };

      await changeUserInfo(this.userId, payload);

      await this.onRegistrationSuccess();
    } catch (e) {
      logger.error(e);
      notistackExternal.error(e);
    }
  };

  onRegistrationSuccess = async () => {
    if (!this.userId) return;

    await this.authModule.authUserAfterRegistration(this.userId);
    const role = this.authModule.userData?.roles?.find((role) => role.role === UserRoles.ABONENT);
    if (!role) return;

    this.rolesModule.selectRole(role);
  };

  verifySmsMethod = async () => {
    try {
      const phone = reformatPhone(this.phone);
      await generateOtp(phone);
      this.selectedVerifyMethod = 'SMS';
      this.goToVerifyCode();
      this.timerState.handleClick();
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };
}
