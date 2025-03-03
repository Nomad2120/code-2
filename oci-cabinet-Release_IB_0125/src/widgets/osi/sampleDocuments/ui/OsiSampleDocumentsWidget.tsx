import {
  IOsiSampleDocumentsWidgetViewModel,
  IOsiSampleDocumentsWidgetViewModelToken
} from '@shared/types/mobx/widgets/OsiSampleDocuments';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import React, { useState } from 'react';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import { Autocomplete, Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Abonent } from '@shared/types/osi/abonents';

export const OsiSampleDocumentsWidget: React.FC = observer(() => {
  const vm = useInjection<IOsiSampleDocumentsWidgetViewModel>(IOsiSampleDocumentsWidgetViewModelToken);

  const [selectedAbonent, setSelectedAbonent] = useState<Abonent | null>(null);
  const [selectedDoc, setSelectedDoc] = useState(-1);
  const { translateToken: tt, t } = useTranslation();

  const docs = [
    { name: t('debts:debtDocs'), fn: vm.downloadDebtor },
    { name: t('debts:notaryDocs'), fn: vm.downloadNotary }
  ];

  const handleDownload = async (abonent: Abonent | null) => {
    if (!abonent) return;

    docs[selectedDoc].fn(abonent);
  };

  const handleDocChange = (event: any) => {
    setSelectedDoc(event.target.value);
  };

  return (
    <Box display="flex" alignItems="center">
      <Grid container spacing={1}>
        <Grid item xs={12} sm={3}>
          <Autocomplete
            fullWidth
            disableClearable
            disabled={vm.isLoading}
            getOptionLabel={(option) => option.flat}
            renderOption={(props, option) => <li {...props}>{option.flat}</li>}
            options={vm.sortedAbonents}
            onChange={(event, value) => {
              setSelectedAbonent(value);
            }}
            // @ts-expect-error autocomplete not work with undefined
            value={selectedAbonent}
            renderInput={(params) => (
              <TextField
                {...params}
                label={tt(tokens.common.formFields.selectFlat.label)}
                size="small"
                InputProps={{
                  ...params.InputProps,
                  autoComplete: 'new-password'
                }}
                style={{ margin: 0 }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            select
            fullWidth
            defaultValue={tt(tokens.common.formFields.selectNotify.label)}
            size="small"
            value={selectedDoc}
            label={tt(tokens.common.formFields.selectNotify.label)}
            onChange={handleDocChange}
            disabled={!selectedAbonent || vm.isLoading}
          >
            {docs.map((item, i) => (
              <MenuItem key={i} value={i}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<CloudDownloadIcon />}
            onClick={() => handleDownload(selectedAbonent)}
            sx={{ ml: 1 }}
            size="medium"
            disabled={selectedDoc < 0 || vm.isLoading}
          >
            <TranslatedToken id={tokens.common.download} />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
});
