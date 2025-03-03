import { observer } from 'mobx-react-lite';
import { ICreateDebtFeatureViewModel, ICreateDebtFeatureViewModelToken } from '@shared/types/mobx/features/OsiDebts';
import { useInjection } from 'inversify-react';
import { useEffect } from 'react';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import {
  Autocomplete,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Dialog
} from '@mui/material';
import moment from 'moment/moment';
import { DataGridPro, GridColDef, GridValueGetterParams, ruRU } from '@mui/x-data-grid-pro';
import { ConfirmDialog } from '@features/osi/debts/createDebt/ui/ConfirmDialog';
import { Controller, useForm } from 'react-hook-form';
import { ServiceGroupResponse } from '@shared/types/osi/services';
import { Abonent } from '@shared/types/osi/abonents';
import { LoadingButton } from '@mui/lab';

const columns: GridColDef[] = [
  {
    field: 'period',
    headerName: 'Период',
    align: 'left',
    minWidth: 150,
    flex: 0.3,
    editable: false,
    sortable: false,
    valueGetter: (params: GridValueGetterParams) =>
      new Date(params.value).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long'
      })
  },
  {
    field: 'amount',
    headerName: 'Сальдо на конец, тг.',
    type: 'number',
    flex: 0.3,
    minWidth: 150,
    align: 'right',
    editable: true,
    sortable: false,
    cellClassName: 'saldo--cell',
    valueGetter: (params: GridValueGetterParams) =>
      typeof params.value === 'number' ? params.value.toFixed(2) : params.value
  }
];

interface FormValues {
  abonent: Abonent | null;
  serviceGroup: ServiceGroupResponse | null;
}

interface Props {
  refreshCb: () => Promise<void>;
}

export const CreateDebtButton: React.FC<Props> = observer(({ refreshCb }) => {
  const vm = useInjection<ICreateDebtFeatureViewModel>(ICreateDebtFeatureViewModelToken);
  const { translateToken: tt } = useTranslation();

  const form = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      serviceGroup: null,
      abonent: null
    }
  });

  useEffect(() => {
    vm.refreshCb = refreshCb;
  }, [refreshCb, vm]);

  useEffect(() => {
    vm.form = form;
  }, [form, vm]);

  const { saldo, list } = vm.debt;

  const { control, watch, setValue } = form;

  const serviceGroup = watch('serviceGroup');
  const abonent = watch('abonent');

  useEffect(() => {
    if (!abonent?.id || !serviceGroup?.id) return;

    vm.loadDebts(abonent.id, serviceGroup.id);
  }, [abonent?.id, serviceGroup?.id, vm]);

  return (
    <>
      <LoadingButton
        loading={vm.isLoading}
        variant="outlined"
        color="primary"
        onClick={vm.startCreatingDebt}
        sx={{ mb: 2, mr: 1 }}
        size="medium"
      >
        <TranslatedToken id={tokens.osiDebts.newDebt.buttonLabel} />
      </LoadingButton>
      <Dialog open={vm.isDialogOpen} onClose={vm.cancelCreatingDebt} maxWidth="md">
        <DialogTitle>
          <TranslatedToken id={tokens.osiDebts.newDebt.title} />
        </DialogTitle>
        <DialogContent>
          <Box minWidth={600} maxWidth={600}>
            <Controller
              control={control}
              name={'serviceGroup'}
              render={({ field, fieldState: { error } }) => (
                <Autocomplete
                  {...field}
                  // @ts-expect-error for autocomplete undefined not working
                  value={field.value}
                  fullWidth
                  disableClearable
                  getOptionLabel={(option) => option?.groupNameRu || ''}
                  renderOption={(props, option) => <li {...props}>{option.groupNameRu}</li>}
                  isOptionEqualToValue={(option, value) => option.groupNameRu === value.groupNameRu}
                  options={vm.groups}
                  onChange={(event, value) => {
                    field.onChange(value);
                    setValue('abonent', null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={tt(tokens.common.formFields.service.label)}
                      margin="normal"
                      InputProps={{
                        ...params.InputProps,
                        autoComplete: 'new-password'
                      }}
                      error={Boolean(error)}
                      helperText={error?.message && tt(tokens.common.formFields.service.validation.need)}
                    />
                  )}
                />
              )}
            />
          </Box>
          <Box minWidth={300} maxWidth={300}>
            <Controller
              control={control}
              name={'abonent'}
              render={({ field, fieldState: { error } }) => (
                <Autocomplete
                  {...field}
                  // @ts-expect-error for autocomplete undefined not working
                  value={field.value}
                  disabled={!serviceGroup}
                  fullWidth
                  disableClearable
                  getOptionLabel={(option) => (option.flat ? `${option.flat} - ${option.name}` : '')}
                  renderOption={(props, option) => <li {...props}>{`${option.flat} - ${option.name}`}</li>}
                  options={vm.getAbonents(serviceGroup?.id ?? null)}
                  isOptionEqualToValue={(option, value) => option.flat === value.flat}
                  onChange={(event, value) => {
                    field.onChange(value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={tt(tokens.common.formFields.flat.label)}
                      margin="normal"
                      InputProps={{
                        ...params.InputProps,
                        autoComplete: 'new-password'
                      }}
                      error={Boolean(error)}
                      helperText={error?.message && tt(tokens.common.formFields.flat.validation.need)}
                    />
                  )}
                />
              )}
            />
          </Box>
          <Box
            sx={{
              '& .saldo--cell': {
                color: '#38aa52',
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'rgba(23,28,36, 0.55)' : 'rgba(239,248,242, 0.55)',
                fontWeight: '800'
              }
            }}
          >
            {list[0]?.period && abonent?.id && (
              <Typography sx={{ mt: 1 }} gutterBottom variant="h6">
                <TranslatedToken id={tokens.osiDebts.newDebt.startSaldoPeriod} />
                {moment(list[0].period).add(1, 'month').toDate().toLocaleString('ru-RU', {
                  year: 'numeric',
                  month: 'long'
                })}
                ": &nbsp;{Number(saldo || 0).toFixed(2)}
              </Typography>
            )}
            <DataGridPro
              localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
              rows={abonent?.id ? list : []}
              columns={columns}
              density="compact"
              disableSelectionOnClick
              onCellEditCommit={vm.onCellEditCommit}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={vm.cancelCreatingDebt}>
            <TranslatedToken id={tokens.common.close} />
          </Button>
        </DialogActions>
      </Dialog>
      {Boolean(vm.confirmData) && (
        <ConfirmDialog
          open={vm.isConfirmDialogOpen}
          onConfirm={vm.onConfirm}
          onCancel={vm.onCancel}
          content={new Date(vm.confirmData?.period).toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'long'
          })}
        />
      )}
    </>
  );
});
