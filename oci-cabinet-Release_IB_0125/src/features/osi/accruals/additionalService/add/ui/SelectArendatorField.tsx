import { observer, useLocalObservable } from 'mobx-react-lite';
import { useController, useForm } from 'react-hook-form';
import {
  Autocomplete,
  Box,
  Button,
  createFilterOptions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  Typography
} from '@mui/material';
import { useTranslation } from '@shared/utils/i18n';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import { Abonent } from '@shared/types/osi/abonents';
import { AddressFields } from '@shared/components/form/addressFields/ui/AddressFields';
import { Field } from '@shared/components/form/Field';
import { yupResolver } from '@hookform/resolvers/yup';
import { addExternalAbonentSchema } from '@shared/validation/osi/services';
import { isEmpty } from 'lodash';
import { SelectArendatorViewModel } from '../model/SelectArendatorViewModel';

interface Props {
  control: any;
  name: string;
  osiId: number;
  disabled?: boolean;
}

const filter = createFilterOptions<Abonent>();
// @ts-expect-error slide not typed
const Transition = forwardRef<unknown, TransitionProps>((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export const SelectArendatorField: React.FC<Props> = observer(({ control, name, osiId, disabled = false }) => {
  const { t } = useTranslation();
  const controller = useController({ control, name });

  const [addressErrors, setAddressErrors] = useState<any>({});

  const {
    field,
    fieldState: { error }
  } = controller;

  const abonentForm = useForm<{ name: string; ars: any; phone: string; bin: string; flat: string }>({
    defaultValues: { name: '' },
    resolver: yupResolver(addExternalAbonentSchema),
    mode: 'all'
  });

  const {
    formState: { errors }
  } = abonentForm;

  const vm = useLocalObservable(() => new SelectArendatorViewModel({ controller, abonentForm, osiId }));

  useEffect(() => {
    vm.controller = controller;
  }, [controller, vm]);

  useEffect(() => {
    vm.abonentForm = abonentForm;
  }, [abonentForm, vm]);

  useEffect(() => {
    vm.osiId = osiId;
  }, [osiId, vm]);

  const options = useMemo(
    () => [
      {
        code: 'custom',
        name: 'Создать...',
        color: 'primary.main'
      },
      ...vm.options
    ],
    [vm.options]
  );

  return (
    <>
      <Autocomplete
        disabled={disabled}
        value={field.value.value}
        inputValue={field.value.inputValue}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            setTimeout(() => {
              vm.openCreatingAbonentDialog();
            });
          } else if (newValue && newValue.inputValue) {
            vm.openCreatingAbonentDialog();
          } else if (newValue?.code === 'custom') {
            vm.openCreatingAbonentDialog();
          } else {
            field.onChange({ inputValue: newValue?.inputValue ?? '', value: newValue });
          }
        }}
        onInputChange={(event, newInputValue) => {
          field.onChange({ ...field.value, inputValue: newInputValue });
        }}
        onOpen={() => vm.loadOptions(osiId)}
        freeSolo
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== '') {
            // filtered.push({
            //   inputValue: params.inputValue,
            //   name: `Создать "${params.inputValue}"`,
            //   color: 'primary.main',
            //   code: 'create'
            // });
          }

          return filtered;
        }}
        loading={vm.isLoading}
        options={options}
        getOptionLabel={(option) => {
          if (option?.inputValue) {
            return option.inputValue;
          }
          return option?.name ?? '';
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => (
          <li {...props}>
            <Typography color={option?.color ?? ''}>{option.name}</Typography>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            required
            label={t('accruals:arendator')}
            // @ts-expect-error strange typing for nested fields
            error={Boolean(error?.message || error?.value?.message)}
            // @ts-expect-error strange typing for nested fields
            helperText={error?.message || error?.value?.message ? t(error?.message || error?.value?.message) : ''}
            size={'small'}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        )}
      />
      <Dialog
        TransitionComponent={Transition}
        open={vm.isCreateAbonentDialogOpen}
        onClose={vm.cancelCreatingAbonent}
        fullWidth
      >
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
            <Field
              control={abonentForm.control}
              name={'name'}
              required
              label={t('accruals:arendator')}
              helperText={errors?.name?.message ? t(errors.name.message) : ''}
            />

            <AddressFields
              onAddressChanged={(ars) => {
                abonentForm.setValue('ars', ars);
              }}
              onFormStateChanged={(formState) => {
                setAddressErrors(formState.errors);
              }}
            />
            <Field
              control={abonentForm.control}
              name={'phone'}
              label={t('common:phone')}
              mask="+7 7## ### ## ##"
              required
              fullWidth
              helperText={errors?.phone?.message ? t(errors.phone.message) : ''}
            />
            <Field
              control={abonentForm.control}
              name={'bin'}
              label={`${t('common:bin')}/${t('common:idn')}`}
              mask="############"
              required
              fullWidth
              helperText={errors?.bin?.message ? t(errors.bin.message) : ''}
            />
            <Field
              control={abonentForm.control}
              name={'flat'}
              label={t('common:flat')}
              required
              fullWidth
              helperText={errors?.flat?.message ? t(errors.flat.message) : ''}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={vm.cancelCreatingAbonent}>
            <Typography>{t('common:close')}</Typography>
          </Button>
          <Button
            disabled={!isEmpty(addressErrors) || !isEmpty(errors)}
            onClick={abonentForm.handleSubmit(vm.submitCreatingAbonent)}
            variant={'contained'}
          >
            <Typography>{t('common:save')}</Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
