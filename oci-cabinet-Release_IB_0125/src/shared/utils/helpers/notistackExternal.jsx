import { useSnackbar } from 'notistack';
import * as React from 'react';
import { Icon } from '@iconify/react';
import closeFill from '@iconify-icons/eva/close-fill';
import { MIconButton } from '@shared/components/@material-extend';
import i18next from 'i18next';

const InnerSnackbarUtilsConfigurator = (props) => {
  props.setUseSnackbarRef(useSnackbar());
  return null;
};

let useSnackbarRef;
const setUseSnackbarRef = (useSnackbarRefProp) => {
  useSnackbarRef = useSnackbarRefProp;
};

export const SnackbarUtilsConfigurator = () => <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />;

export default {
  warning(msg) {
    this.toast(msg, 'warning');
  },
  info(msg) {
    this.toast(msg, 'info');
  },
  error(msgToken) {
    this.toast(i18next.t(msgToken || 'common:error'), 'error');
  },
  success(msgToken) {
    this.toast(i18next.t(msgToken || 'common:success'), 'success');
  },
  saved() {
    this.toast(i18next.t('common:saved'), 'success');
  },
  noAuth() {
    this.error('common:noAuth');
  },

  toast(msg, variant = 'default') {
    useSnackbarRef.enqueueSnackbar(msg, {
      variant,
      autoHideDuration: 10000,
      preventDuplicate: true,
      action: (key) => (
        <MIconButton size="small" onClick={() => useSnackbarRef.closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      )
    });
  }
};
