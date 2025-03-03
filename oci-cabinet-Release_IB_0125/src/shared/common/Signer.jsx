import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import DialogIconButton from './DialogIconButton';
import { tokens, useTranslation } from '../utils/i18n';

import NCALayer from '../utils/helpers/ncalayer';
import notistack from '../utils/helpers/notistackExternal';

const Signer = ({ data, content, onPostSign }) => {
  const defaultStorage = 'PKCS12';

  const [storage, setStorage] = useState(defaultStorage);
  const [containers, setContainers] = useState([defaultStorage]);
  const [ncaAvailable, setNcaAvailable] = useState(false);
  const { translateToken: tt } = useTranslation();

  let closed = false;
  const [socket] = useState(new NCALayer(new WebSocket('wss://127.0.0.1:13579/')));

  const onConnect = () => {
    setNcaAvailable(true);
    getActiveTokens();
  };

  const onDisconnect = () => {
    setNcaAvailable(false);
    if (!closed) notistack.error(tt(tokens.signer.notConnectToNCAlayer));
  };

  const onMessage = () => {};

  const onGetActiveTokens = (result) => {
    if (result.code === '500') {
      notistack.error(`${tt(tokens.signer.ncaLayerError)}: ${result.message}`);
      return;
    }

    if (result.code === '200') {
      let newTokens = [];
      if (result?.responseObject?.length) {
        newTokens = result?.responseObject?.reduce((acc, item) => {
          if (!containers.includes(item)) {
            return [...acc, item];
          }
          return acc;
        }, []);
      }
      setContainers([...containers, ...newTokens]);
    }
  };

  const onCreateCMS = (result) => {
    if (result.code === '500') {
      notistack.error(`${tt(tokens.signer.ncaLayerError)}: ${result.message}`);
      return;
    }

    if (result.code === '200') {
      onPostSign(result.responseObject);
    }
  };

  const getActiveTokens = () => {
    if (socket) {
      socket.emit({
        module: 'kz.gov.pki.knca.commonUtils',
        method: 'getActiveTokens'
      });
    }
  };

  useEffect(() => {
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message', onMessage);
    socket.on('getActiveTokens', onGetActiveTokens);
    socket.on('createCMSSignatureFromBase64', onCreateCMS);

    return function cleanup() {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      closed = true;
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleChange = (event) => {
    setStorage(event.target.value);
  };

  const sign = () => {
    const createCMSSignatureFromBase64 = {
      module: 'kz.gov.pki.knca.commonUtils',
      method: 'createCMSSignatureFromBase64',
      args: [storage, 'SIGNATURE', data, true]
    };
    socket.emit(createCMSSignatureFromBase64);
  };

  return (
    <>
      <FormControl variant="standard" sx={{ mt: -1, mr: 2, minWidth: 200 }}>
        <InputLabel id="container-label">{tt(tokens.signer.storage)}</InputLabel>
        <Select labelId="container-label" id="container-select" value={storage} onChange={handleChange}>
          {containers.map((e, idx) => (
            <MenuItem key={idx} value={e}>
              {e}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <DialogIconButton
          label={tt(tokens.signer.sign)}
          title={tt(tokens.signer.dialogTite)}
          content={content}
          onAgree={() => {
            sign();
          }}
          disabled={!ncaAvailable || !data}
        />
      </FormControl>
    </>
  );
};

Signer.propTypes = {
  data: PropTypes.any,
  content: PropTypes.node,
  onPostSign: PropTypes.func
};

export default Signer;
