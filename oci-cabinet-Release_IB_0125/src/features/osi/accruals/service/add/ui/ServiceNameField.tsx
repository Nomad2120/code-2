import { observer, useLocalObservable } from 'mobx-react-lite';
import { Controller, useController, UseControllerProps, useForm } from 'react-hook-form';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  Typography
} from '@mui/material';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import React, { forwardRef, useRef } from 'react';
import { ServiceNameViewModel } from '@features/osi/accruals/service/add/model/ServiceNameViewModel';
import { Field } from '@shared/components/form/Field';

interface Props extends UseControllerProps {
  control: any;
  options: any[];
  allowCustomName?: boolean;
  disabled?: boolean;
}

// @ts-expect-error slide not typed
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export const ServiceNameField: React.FC<Props> = observer(
  ({ control, name, options, allowCustomName = true, disabled = false }) => {
    const {
      field,
      fieldState: { error }
    } = useController({ control, name });
    const hookForm = useForm({
      defaultValues: {
        customName: ''
      }
    });
    const { t, fieldWithPrefix: fwp } = useTranslation();
    const vm = useLocalObservable(() => new ServiceNameViewModel());

    const createServiceOptions = () => {
      const defaultServices = options.map((item) => ({ code: 'default', ...item }));
      if (allowCustomName) return [{ code: 'create', nameRu: `${t('accruals:createService')}...` }, ...defaultServices];

      return defaultServices;
    };

    const onCustomNameSave = (values: { customName: string }) => {
      field.onChange({
        code: 'custom',
        nameRu: values.customName,
        nameKz: values.customName
      });
      vm.closeDialog();
      hookForm.reset();
    };

    return (
      <>
        {field.value?.code === 'custom' ? (
          <Field
            {...field}
            value={field.value.nameRu}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              field.onChange({
                ...field.value,
                nameRu: e.target.value,
                nameKz: e.target.value
              })
            }
            control={control}
            fullWidth
            sx={{ mb: 2 }}
            disabled={disabled}
            label={t('accruals:service')}
            InputLabelProps={{ shrink: true }}
            // @ts-expect-error strange typing for nested fields
            error={Boolean(error?.message || error?.nameRu?.message)}
            // @ts-expect-error strange typing for nested fields
            helperText={t((error?.message || error?.nameRu?.message) ?? '')}
          />
        ) : (
          <Autocomplete
            {...field}
            disabled={disabled}
            sx={{ mt: 2, mb: 2 }}
            onChange={(e, value) => {
              if (value?.code === 'create') {
                vm.openDialog();
                return;
              }

              field.onChange(value);
            }}
            onInputChange={(e, value) => {
              if (field.value?.code === 'custom') {
                field.onChange({ ...field.value, nameRu: value, nameKz: value });
              }
            }}
            size={'small'}
            options={createServiceOptions()}
            getOptionLabel={(option) => option.nameRu}
            renderOption={(props, option) => <li {...props}>{fwp(option, 'name')}</li>}
            isOptionEqualToValue={(option, value) => option.nameRu === value.nameRu}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ m: 0 }}
                label={t('accruals:service')}
                // @ts-expect-error strange typing for nested fields
                error={Boolean(error?.message || error?.nameRu?.message)}
                // @ts-expect-error strange typing for nested fields
                helperText={t((error?.message || error?.nameRu?.message) ?? '')}
                InputProps={{
                  ...params.InputProps,
                  autoComplete: 'new-password'
                }}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        )}

        {/* @ts-expect-error  transition component not typed */}
        <Dialog open={vm.isDialogOpen} onClose={vm.closeDialog} TransitionComponent={Transition}>
          <DialogTitle>
            <Typography>{t('accruals:addServiceTitle')}</Typography>
          </DialogTitle>
          <DialogContent>
            <Controller
              control={hookForm.control}
              name={'customName'}
              render={({ field: customName }) => (
                <TextField {...customName} sx={{ mt: 2 }} label={t('accruals:service')} fullWidth autoFocus />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button color="inherit" onClick={vm.closeDialog}>
              <Typography>{t('common:cancel')}</Typography>
            </Button>
            <Button variant="contained" color="success" onClick={hookForm.handleSubmit(onCustomNameSave)}>
              <Typography>{t('common:accepted')}</Typography>
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);
