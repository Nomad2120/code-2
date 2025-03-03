import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import { Box, Card, CardActions, CardContent, Grid, MenuItem, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { Field } from '@shared/components/form/Field';
import { useTheme } from '@mui/material/styles';
import { observer } from 'mobx-react-lite';
import { materials } from '@shared/constants/dictionary';
import { Control } from 'react-hook-form';

import { OsiInfoValues } from '@shared/types/osi';

interface Props {
  control: Control<OsiInfoValues>;
  onSubmit: () => any;
  SaveButtonComponent?: ReactNode;
  FacilitiesComponent?: ReactNode;
  DocsComponent?: ReactNode;
  osiUnionTypeName: {
    Ru: string;
    Kz: string;
  };
  lockedFields?: string[];
}

export const OsiInfoForm: React.FC<Props> = observer(
  ({ control, onSubmit, SaveButtonComponent, FacilitiesComponent, DocsComponent, osiUnionTypeName, lockedFields }) => {
    const { translateToken: tt, fieldWithPrefix: fwp, getLocale } = useTranslation();
    const theme = useTheme();

    const isFieldLocked = (fieldName: string) => {
      const isLocked = lockedFields?.includes(fieldName);
      return isLocked;
    };

    return (
      <form onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <TranslatedToken id={tokens.osiInfo.mainInfo.title} />
                </Typography>
                <Grid container spacing={2} sx={{ padding: theme.spacing(1.5, 0) }}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      data-test-id={'osi-name'}
                      label={`${tt(tokens.common.formFields.osiName.label)} ${
                        getLocale() === 'ru' ? osiUnionTypeName.Ru : osiUnionTypeName.Kz
                      }`}
                      control={control}
                      name={'name'}
                      required
                      fullWidth
                      disabled={isFieldLocked('name')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      data-test-id={'osi-bin'}
                      label={`${tt(tokens.common.formFields.IDNOSI.label)} ${
                        getLocale() === 'ru' ? osiUnionTypeName.Ru : osiUnionTypeName.Kz
                      }`}
                      control={control}
                      name={'idn'}
                      mask="############"
                      required
                      fullWidth
                      disabled={isFieldLocked('idn')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      data-test-id={'osi-fio'}
                      label={tt(tokens.common.formFields.fioChairman.label)}
                      control={control}
                      name={'fio'}
                      required
                      fullWidth
                      disabled={isFieldLocked('fio')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      data-test-id={'osi-phone'}
                      label={tt(tokens.common.formFields.phone.label)}
                      control={control}
                      name={'phone'}
                      mask="+7 7## ### ## ##"
                      required
                      fullWidth
                      disabled={isFieldLocked('phone')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      data-test-id={'osi-email'}
                      label={tt(tokens.common.formFields.email.label)}
                      control={control}
                      name={'email'}
                      fullWidth
                      disabled={isFieldLocked('email')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      data-test-id={'osi-floor'}
                      label={tt(tokens.common.formFields.floorCount.label)}
                      control={control}
                      name={'floors'}
                      mask="###"
                      disabled={isFieldLocked('floors')}
                    />
                  </Grid>
                </Grid>
                {FacilitiesComponent && FacilitiesComponent}
                {DocsComponent && DocsComponent}
              </CardContent>
              <CardActions className={'justify-end'}>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }} margin={theme.spacing(2)}>
                  {SaveButtonComponent && SaveButtonComponent}
                </Box>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </form>
    );
  }
);
