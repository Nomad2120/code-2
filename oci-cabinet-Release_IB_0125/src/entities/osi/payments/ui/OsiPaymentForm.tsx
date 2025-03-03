import { IOsiPaymentFormViewModel, IOsiPaymentFormViewModelToken } from '@shared/types/mobx/entities/osiPayments';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { useEffect } from 'react';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import { Form, FormikProvider, useFormik } from 'formik';
import { Autocomplete, Box, TextField } from '@mui/material';
import MaskInput from '@shared/common/MaskInput';
import { LoadingButton, MobileDateTimePicker } from '@mui/lab';
import moment from 'moment/moment';
import { isEmpty } from 'lodash';
import { FormSchema } from '@shared/validation/osi/payments';
import { Abonent } from '@shared/types/osi/abonents';

interface Props {
  groups: any[];
  abonents: Abonent[];
  onSubmit: (values: any) => Promise<void>;
  onClose: () => void;
}

interface FormikValues {
  abonent: Abonent | null;
  group: any;
  amount: any;
  reason: string;
  date: Date | null;
}

export const OsiPaymentForm: React.FC<Props> = observer(({ groups, abonents, onSubmit, onClose }) => {
  const vm = useInjection<IOsiPaymentFormViewModel>(IOsiPaymentFormViewModelToken);

  const { translateToken: tt, fieldWithPrefix: fwp } = useTranslation();

  useEffect(() => {
    vm.onSubmit = onSubmit;
  }, [onSubmit, vm]);

  useEffect(() => {
    vm.abonents = abonents;
  }, [abonents, vm]);

  const formik = useFormik<FormikValues>({
    initialValues: {
      abonent: null,
      group: null,
      amount: '',
      reason: '',
      date: moment().local().toDate()
    },
    validationSchema: FormSchema,
    onSubmit: vm.onSubmit
  });

  const { values, errors, touched, isSubmitting, handleSubmit, setValues, setTouched } = formik;

  const getAbonents = () => vm.getAbonents(formik.values.group?.group_id ?? 0);

  const renderAbonentItem = (props: any, option: any) => <li {...props}>{vm.getAbonentOptionLabel(option)}</li>;

  const onChangeAbonent = async (event: any, value: any) => {
    if (!value) {
      formik.setFieldValue('abonent', null, true);
      return;
    }
    formik.setFieldValue('abonent', value, true);
  };

  const renderGroupItem = (props: any, option: any) => <li {...props}>{`${fwp(option, 'name')}`}</li>;

  const onChangeGroup = async (event: any, value: any) => {
    await formik.setFieldValue('abonent', null, true);
    if (!value) {
      await formik.setFieldValue('group', null, true);
      return;
    }
    await formik.setFieldValue('group', value, true);
    await formik.validateForm();
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Box minWidth={300}>
          <Autocomplete
            {...formik.getFieldProps('group')}
            data-testid="ac_groups"
            fullWidth
            disableClearable
            // options={isCorrection() ? groups.filter((group) => group.canCreateFixes) : groups}
            options={groups}
            getOptionLabel={(option) => fwp(option, 'name') || ''}
            isOptionEqualToValue={(option, value) => fwp(option, 'name') === fwp(value, 'name')}
            renderOption={renderGroupItem}
            onChange={onChangeGroup}
            renderInput={(params) => (
              <TextField
                {...params}
                label={tt(tokens.common.formFields.serviceGroup.label)}
                margin="normal"
                error={Boolean(formik.errors.group && formik.touched.group)}
                onBlur={() => {
                  formik.setFieldTouched('group');
                }}
                // @ts-expect-error not typed
                helperText={formik.touched.group && tt(formik.errors.group)}
                InputProps={{ ...params.InputProps, autoComplete: 'new-password' }}
              />
            )}
          />
          <Autocomplete
            {...formik.getFieldProps('abonent')}
            disabled={formik.values.group === null}
            data-testid="autocomplete"
            fullWidth
            disableClearable
            options={getAbonents()}
            getOptionLabel={(option) => {
              if (option.external) {
                return `Аренда(${option.name || option.flat})`;
              }

              return option.flat;
            }}
            renderOption={renderAbonentItem}
            isOptionEqualToValue={(option, value) => option.flat === value.flat}
            onChange={onChangeAbonent}
            renderInput={(params) => (
              <TextField
                {...params}
                label={tt(tokens.common.formFields.room.label)}
                margin="normal"
                InputProps={{
                  ...params.InputProps,
                  autoComplete: 'new-password'
                }}
                onBlur={() => {
                  formik.setFieldTouched('abonent');
                }}
                error={Boolean(
                  (touched.abonent && errors.abonent) || (formik.values.group === null && 'Укажите группу')
                )}
                helperText={
                  // @ts-expect-error not typed
                  (touched.abonent && tt(errors.abonent)) || (formik.values.group === null && 'Укажите группу')
                }
              />
            )}
          />
          <MaskInput
            sx={{ mt: 2 }}
            style={{ width: '100%' }}
            label={`${tt(tokens.common.formFields.sum.label)}, тенге`}
            type="amount"
            align="right"
            allowNegative={false}
            error={Boolean(touched.amount && errors.amount)}
            // @ts-expect-error not typed
            helperText={touched.amount && tt(errors.amount)}
            onChange={(e) => {
              if (!e.target.value && e.target.value !== '0') setValues({ ...values, amount: '' });
              else setValues({ ...values, amount: e.target.value });
            }}
            onBlur={() => {
              setTouched({ ...touched, amount: true });
            }}
          />
          <MobileDateTimePicker
            minDate={moment().local().startOf('month').toDate()}
            // @ts-expect-error not typed
            sx={{ mt: 2 }}
            value={values.date}
            toolbarTitle={tt(tokens.common.formFields.paymentDate.validation.need)}
            okText={tt(tokens.common.select)}
            cancelText={tt(tokens.common.cancel)}
            onChange={(newValue) => {
              setValues({
                ...values,
                date: newValue
              });
            }}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton onClick={onClose}>
              <TranslatedToken id={tokens.common.cancel} />
            </LoadingButton>
            <LoadingButton
              onClick={() => handleSubmit()}
              sx={{ ml: 2 }}
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={!values.amount || !isEmpty(errors) || vm.isLoading}
            >
              <TranslatedToken id={tokens.common.save} />
            </LoadingButton>
          </Box>
        </Box>
      </Form>
    </FormikProvider>
  );
});
