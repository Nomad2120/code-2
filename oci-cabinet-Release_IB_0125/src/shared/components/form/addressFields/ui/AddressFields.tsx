import { observer } from 'mobx-react-lite';
import AutoCompleteEdit from '@shared/common/AutoCompleteEdit';
import { useTranslation } from '@shared/utils/i18n';
import React, { useEffect } from 'react';
import { Stack } from '@mui/material';
import { useAddressFields } from '@shared/components/form/addressFields/hooks/useAddressFields';
import { Controller } from 'react-hook-form';

interface Props {
  onAddressChanged: (values: any) => void;
  onFormStateChanged?: (errors: any) => void;
  initialValues?: any;
}

export const AddressFields: React.FC<Props> = observer(({ onAddressChanged, onFormStateChanged, initialValues }) => {
  const { t } = useTranslation();

  const { form, vm } = useAddressFields({
    initialValues: initialValues ?? {
      city: '',
      street: '',
      building: ''
    }
  });

  const { control, watch, setValue } = form;

  const [city, street] = watch(['city', 'street']);

  const building = watch('building');

  const values = form.getValues();

  useEffect(() => {
    onAddressChanged(form.getValues());
  }, [building, onAddressChanged, form]);

  useEffect(() => {
    onFormStateChanged?.(form.formState);

    console.log('errors addr', { errs: form.formState.errors, values: form.getValues() });
  }, [form.formState, onFormStateChanged, form.formState.errors, building]);

  useEffect(() => {
    console.log('addressFields', { values: form.getValues() });
  }, [values]);

  return (
    <Stack spacing={2} sx={{ my: 1 }}>
      <Controller
        control={control}
        name={'city'}
        render={({ field: { onChange, value, name }, fieldState: { error } }) => (
          <AutoCompleteEdit
            textFieldProps={{
              size: 'small',
              InputLabelProps: { shrink: true }
            }}
            name={name}
            required
            id="at-cbox"
            label={t('common:addressFields.city.label')}
            shortName="nameRus"
            fullName="fullPathRus"
            onFetch={vm.fetchCity}
            error={Boolean(error)}
            helperText={error?.message ? t(error.message) : ''}
            onChange={(e: any, v: any) => {
              setValue('street', '');
              setValue('building', '');
              onChange(v);
              form.trigger();
            }}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name={'street'}
        render={({ field: { value, onChange, name }, fieldState: { error } }) => (
          <AutoCompleteEdit
            textFieldProps={{
              size: 'small',
              InputLabelProps: { shrink: true }
            }}
            name={name}
            required
            id="geonim-cbox"
            label={t('common:addressFields.street.label')}
            shortName="nameRus"
            fullName="fullPathRus"
            onFetch={(req: any) => vm.fetchStreet(city?.id, req)}
            error={Boolean(error)}
            helperText={error?.message ? t(error?.message) : ''}
            onChange={(e: any, v: any) => {
              setValue('building', '');
              onChange(v);
              form.trigger();
            }}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name={'building'}
        render={({ field: { value, onChange, name }, fieldState: { error } }) => (
          <AutoCompleteEdit
            textFieldProps={{
              size: 'small',
              InputLabelProps: { shrink: true }
            }}
            name={name}
            required
            id="building-cbox"
            label={t('common:addressFields.building.label')}
            shortName="number"
            fullName="shortPathRus"
            onFetch={(req: any) => vm.fetchBuilding(street?.id, req)}
            error={Boolean(error)}
            helperText={error?.message ? t(error.message) : ''}
            value={value}
            onChange={(e: any, v: any) => {
              onChange(v);
              form.trigger();
            }}
          />
        )}
      />
    </Stack>
  );
});
