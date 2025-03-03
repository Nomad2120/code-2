import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Button } from '@mui/material';
import React from 'react';
import { IOsiAbonentsWidgetViewModel } from '@shared/types/mobx/widgets/OsiAbonentsWidget';
import { observer } from 'mobx-react-lite';
import { useTranslation } from '@shared/utils/i18n';

interface Props {
  vm: IOsiAbonentsWidgetViewModel;
}

export const ImportAbonentsButton: React.FC<Props> = observer(({ vm }) => {
  const { t } = useTranslation();

  return (
    <>
      <input
        accept="excel/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={async (e) => {
          if (!e.target.value || !e.target.files?.length) return;

          await vm.importAbonents(e.target.files[0]);
          // @ts-expect-error нужно для обнуления, ts не поддерживает синтаксис
          e.target.value = null;
        }}
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="raised-button-file">
        <Button variant="outlined" color="primary" component={'span'} startIcon={<CloudDownloadIcon />} sx={{ ml: 2 }}>
          {t('common:attach')}
        </Button>
      </label>
    </>
  );
});
