import { observer } from 'mobx-react-lite';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { useInjection } from 'inversify-react';
import { RegistrationViewModel } from '@widgets/registration/model';
import { useFormik } from 'formik';
import { RegistrationFormEditSchema } from '@entities/registration/RegistrationForm/Edit/config/validationSchema';
import React, { useEffect } from 'react';
import { getFormikHelper } from '@shared/utils/helpers/formikHelpers';
import api from '@app/api';
import { Box, Card, CardContent, Grid, MenuItem, Stack, TextField } from '@mui/material';
import MaskInput from '@shared/common/MaskInput';
import AutoCompleteEdit from '@shared/common/AutoCompleteEdit';
import { MotionInView, varFadeIn } from '@shared/components/animate';
import { RegistrationFormEditViewModel } from '@entities/registration/RegistrationForm/Edit/model/viewModel';

interface Props {
  vm: RegistrationFormEditViewModel;
}

export const Form: React.FC<Props> = observer(({ vm }) => {
  const { translateToken: tt, fieldWithPrefix: fwp, t } = useTranslation();
  const registrationViewModel = useInjection(RegistrationViewModel);

  const formik = useFormik({
    initialValues: vm.initialValues,
    validationSchema: RegistrationFormEditSchema,
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      vm.submit(values);
    }
  });

  useEffect(() => {
    vm.syncFormik(formik);
    registrationViewModel.syncFormik(formik);
  }, [formik]);

  const { getFieldProps, errors, setFieldValue } = formik;

  const getHelperText = getFormikHelper(formik, tt);

  const ats = 'arInfo.ats';
  const geonim = 'arInfo.geonim';
  const building = 'arInfo.building';

  const fetchBuildings = (id: any) => (req: any) => api.findBuildings(id, req);
  const fetchStreet = (id: any) => (req: any) => api.findGeonims(id, req);
  const fetchCity = (req: any) => api.findATS(req);

  const getUnionFieldLabel = () => {
    // eslint-disable-next-line eqeqeq
    const union = vm.unionTypes?.find((union: any) => union.id == formik?.values?.unionTypeId);
    const unionNameRu = union?.nameRu ?? '';

    const labelText = `${t('common:bin')} / ${t('common:idn')} ${unionNameRu}`;

    return labelText;
  };

  return (
    <form autoComplete="off">
      <Grid container />
      <Grid item xs>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  select
                  fullWidth
                  required
                  size="small"
                  label={tt(tokens.common.formFields.unionType.label)}
                  error={Boolean(errors.unionTypeId)}
                  helperText={getHelperText('unionTypeId')}
                  {...getFieldProps('unionTypeId')}
                >
                  {vm.unionTypes?.map((item: any) => (
                    <MenuItem key={item.id} value={item.id}>
                      {fwp(item, 'name')}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label={tt(tokens.common.formFields.osiName.label)}
                  {...getFieldProps('name')}
                  error={Boolean(errors.name)}
                  helperText={getHelperText('name')}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <MaskInput
                  size="small"
                  required
                  label={getUnionFieldLabel()}
                  mask="############"
                  {...getFieldProps('idn')}
                  error={Boolean(errors.idn)}
                  helperText={getHelperText('idn')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label={tt(tokens.common.formFields.fioChairman.label)}
                  {...getFieldProps('fio')}
                  error={Boolean(errors.fio)}
                  helperText={getHelperText('fio')}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <MaskInput
                  mask="+7 7## ### ## ##"
                  size="small"
                  required
                  label={tt(tokens.common.formFields.phone.label)}
                  {...getFieldProps('phone')}
                  error={Boolean(errors.phone)}
                  helperText={getHelperText('phone')}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label={tt(tokens.common.formFields.email.label)}
                  {...getFieldProps('email')}
                  error={Boolean(errors.email)}
                  helperText={getHelperText('email')}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <MaskInput
                  size="small"
                  required
                  label={tt(tokens.common.formFields.flatCount.label)}
                  mask="####"
                  error={Boolean(errors.apartCount)}
                  helperText={getHelperText('apartCount')}
                  {...getFieldProps('apartCount')}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Stack spacing={2}>
                  <AutoCompleteEdit
                    id="at-cbox"
                    size="small"
                    required
                    label={tt(tokens.common.formFields.ats.label)}
                    onFetch={fetchCity}
                    onChange={(e: React.ChangeEvent<any>) => {
                      setFieldValue(geonim, null);
                      setFieldValue(building, null);
                      formik.handleChange(e);
                    }}
                    shortName="nameRus"
                    name={ats}
                    fullName="fullPathRus"
                    value={formik.values.arInfo?.ats}
                    error={Boolean((errors as any).arInfo?.ats)}
                    helperText={getHelperText(ats)}
                  />
                  {formik.values.arInfo?.ats && (
                    <MotionInView variants={varFadeIn} transition={undefined} threshold={undefined}>
                      <AutoCompleteEdit
                        id="geonim-cbox"
                        size="small"
                        required
                        label={tt(tokens.common.formFields.geonim.label)}
                        onFetch={fetchStreet(formik.values?.arInfo?.ats?.id)}
                        onChange={(e: React.ChangeEvent<any>) => {
                          setFieldValue(building, null);
                          formik.handleChange(e);
                        }}
                        shortName="nameRus"
                        name={geonim}
                        fullName="fullPathRus"
                        value={formik.values.arInfo?.geonim}
                        error={Boolean((errors as any).arInfo?.geonim)}
                        helperText={getHelperText(geonim)}
                      />
                    </MotionInView>
                  )}
                  {formik.values.arInfo?.geonim && (
                    <MotionInView variants={varFadeIn} transition={undefined} threshold={undefined}>
                      <AutoCompleteEdit
                        id="building-cbox"
                        size="small"
                        required
                        label={tt(tokens.common.formFields.building.label)}
                        onFetch={fetchBuildings(formik.values?.arInfo?.geonim?.id)}
                        shortName="number"
                        fullName="shortPathRus"
                        error={Boolean((errors as any).arInfo?.building)}
                        helperText={getHelperText(building)}
                        {...getFieldProps(building)}
                      />
                    </MotionInView>
                  )}
                </Stack>
              </Grid>
            </Grid>
            <Box>
              {/* <Button disabled={!(formik.isValid && isEmpty(errors))} onClick={(e) => formik.handleSubmit(e as any)}> */}
              {/*  <TranslatedToken id={tokens.common.save} /> */}
              {/* </Button> */}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </form>
  );
});
