import { observer } from 'mobx-react-lite';
import { FormControlLabel, Switch } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from '@shared/utils/i18n';
import { Facility, OsiInfoValues } from '@shared/types/osi';
import { facilities } from '@shared/constants/dictionary';

interface Props {
  control: Control<any>;
}

export const OsiFacilities: React.FC<Props> = observer(({ control }) => {
  const { translateToken: tt } = useTranslation();

  return (
    <>
      {facilities.map((facility: Facility) => (
        <FormControlLabel
          sx={{
            '@media (min-width: 700px)': {
              width: '50%'
            },
            '@media (max-width: 700px)': {
              width: '100%'
            },
            marginRight: 0
          }}
          key={facility.value}
          control={
            <Controller
              control={control}
              name={facility.value}
              render={({ field }) => <Switch {...field} color="primary" />}
            />
          }
          label={tt(facility.labelToken)}
        />
      ))}
    </>
  );
});
