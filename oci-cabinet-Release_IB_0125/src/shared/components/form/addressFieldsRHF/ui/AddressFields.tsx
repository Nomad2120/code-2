import { observer } from 'mobx-react-lite';
import AutoCompleteEdit from '@shared/common/AutoCompleteEdit';
import { useTranslation } from '@shared/utils/i18n';
import { Stack } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import api from '@app/api';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';

export const AddressFields: React.FC = observer(() => {
  const { t } = useTranslation();
  const hookForm = useFormContext();

  const fetchCity = async (req: string) => {
    try {
      return await api.findATS(req);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  const fetchStreet = async (cityId: number, req: string) => {
    try {
      return await api.findGeonims(cityId, req);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  const fetchBuilding = async (streetId: number, req: string) => {
    try {
      return await api.findBuildings(streetId, req);
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  const { control, watch } = hookForm;

  const [city, street] = watch(['arInfo.city', 'arInfo.street']);

  return (
    <Stack spacing={2} sx={{ my: 1 }}>
      <Controller
        control={control}
        name={'arInfo.city'}
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
            onFetch={fetchCity}
            error={Boolean(error)}
            helperText={error?.message ? t(error.message) : ''}
            onChange={(e: any, v: any) => {
              hookForm.resetField('arInfo.street');
              hookForm.setValue('arInfo.street', '');
              hookForm.resetField('arInfo.building');
              hookForm.setValue('arInfo.building', '');
              onChange(v);
            }}
            value={value}
          />
        )}
      />

      {!!city && (
        <Controller
          control={control}
          name={'arInfo.street'}
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
              onFetch={(req: any) => fetchStreet(city?.id, req)}
              error={Boolean(error)}
              helperText={error?.message ? t(error?.message) : ''}
              onChange={(e: any, v: any) => {
                hookForm.resetField('arInfo.building');
                hookForm.setValue('arInfo.building', '');
                onChange(v);
              }}
              value={value}
            />
          )}
        />
      )}

      {!!city && !!street && (
        <Controller
          control={control}
          name={'arInfo.building'}
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
              onFetch={(req: any) => fetchBuilding(street?.id, req)}
              error={Boolean(error)}
              helperText={error?.message ? t(error.message) : ''}
              value={value}
              onChange={(e: any, v: any) => {
                onChange(v);
              }}
            />
          )}
        />
      )}
    </Stack>
  );
});
