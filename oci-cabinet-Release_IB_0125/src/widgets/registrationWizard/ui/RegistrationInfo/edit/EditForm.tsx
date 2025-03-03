import { observer } from 'mobx-react-lite';
import { Card, CardContent, Grid, MenuItem } from '@mui/material';
import { Field } from '@shared/components/form/Field';
import { FormProvider, useForm } from 'react-hook-form';
import { RegistrationFormEditSchema } from '@entities/registration/RegistrationForm/Edit/config/validationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRegistrationWizardContext } from '@widgets/registrationWizard/store/RegistrationWizardProvider';
import { useGetApiCatalogsUnionTypes } from '@shared/api/orval/catalogs/catalogs';
import { tokens, useTranslation } from '@shared/utils/i18n';
import LoadingScreen from '@shared/components/LoadingScreenFullScreen';
import { AddressFields } from '@shared/components/form/addressFieldsRHF/ui/AddressFields';
import { WizardButtons } from '@widgets/registrationWizard/ui/RegistrationInfo/edit/WizardButtons';
import { defaultValues, RegistrationInfoEditViewModel } from '@widgets/registrationWizard/store/RegistrationInfo/edit';
import { useInjection } from 'inversify-react';
import { DevTool } from '@hookform/devtools';
import { useEffect } from 'react';
import { isEqual } from 'lodash';

export const EditForm: React.FC = observer(() => {
  const { fieldWithPrefix: fwp, t, translateToken: tt } = useTranslation();
  const wizard = useRegistrationWizardContext();
  const viewModel = useInjection<RegistrationInfoEditViewModel>(RegistrationInfoEditViewModel);
  const { data, isLoading: isUnionTypesLoading } = useGetApiCatalogsUnionTypes();

  const hookForm = useForm({
    defaultValues,
    resolver: yupResolver(RegistrationFormEditSchema),
    mode: 'all'
  });

  const { control } = hookForm;

  const isLoadingFormData = isEqual(hookForm.getValues(), defaultValues);

  useEffect(() => {
    viewModel.hookForm = hookForm;
  }, [hookForm, viewModel]);

  useEffect(() => {
    viewModel.wizard = wizard;
  }, [viewModel, wizard]);

  useEffect(() => () => viewModel.cleanup(), [viewModel]);

  const isLoading = isUnionTypesLoading || isLoadingFormData || viewModel.isLoading || wizard.isLoading;

  if (!data?.result || isLoading) return <LoadingScreen />;

  const unionTypes = data.result;

  const getUnionFieldLabel = () => {
    // eslint-disable-next-line eqeqeq
    const union = unionTypes?.find((union: any) => union.id == hookForm.getValues('unionTypeId'));
    const unionNameRu = union?.nameRu ?? '';

    const labelText = `${t('common:bin')} / ${t('common:idn')} ${unionNameRu}`;

    return labelText;
  };

  return (
    <FormProvider {...hookForm}>
      <form autoComplete={'off'}>
        <Grid container>
          <Grid item xs>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Field
                      control={control}
                      name={'unionTypeId'}
                      select
                      label={tt(tokens.common.formFields.unionType.label)}
                      required
                      fullWidth
                    >
                      {unionTypes.map((unionType) => (
                        <MenuItem key={unionType.id} value={unionType.id}>
                          {fwp(unionType, 'name')}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name={'name'}
                      control={control}
                      label={tt(tokens.common.formFields.osiName.label)}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Field
                      name={'idn'}
                      control={control}
                      label={getUnionFieldLabel()}
                      required
                      fullWidth
                      mask={'############'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name={'fio'}
                      control={control}
                      label={tt(tokens.common.formFields.fioChairman.label)}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Field
                      name={'phone'}
                      control={control}
                      label={tt(tokens.common.formFields.phone.label)}
                      required
                      fullWidth
                      mask={'+7 7## ### ## ##'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Field
                      name={'email'}
                      control={control}
                      label={tt(tokens.common.formFields.email.label)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Field
                      name={'apartCount'}
                      control={control}
                      label={tt(tokens.common.formFields.flatCount.label)}
                      required
                      mask={'####'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <AddressFields />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <DevTool control={control} placement={'top-right'} />
      </form>
      <WizardButtons onSubmit={viewModel.updateRegistration} />
    </FormProvider>
  );
});
