import {
  IOsiCorrectionFormViewModel,
  IOsiCorrectionFormViewModelToken
} from '@shared/types/mobx/entities/osiCorrections';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import { useEffect } from 'react';
import { Form, FormikProvider, useFormik, useFormikContext } from 'formik';
import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import MaskInput from '@shared/common/MaskInput';
import { LoadingButton } from '@mui/lab';
import { isEmpty } from 'lodash';
import { Abonent } from '@shared/types/osi/abonents';
import { CorrectionFormSchema } from '@shared/validation/osi/correction';
import { toJS } from 'mobx';
import {
  getGetApiTransactionsSaldoAbonentIdQueryKey,
  useGetApiTransactionsSaldoAbonentId
} from '@shared/api/orval/transactions/transactions';
import { queryClient } from '@shared/api/reactQuery';

type CorrectionService = {
  // eslint-disable-next-line camelcase
  service_id: number;
  // eslint-disable-next-line camelcase
  name_ru: string;
  // eslint-disable-next-line camelcase
  name_kz: string;
};

type CorrectionGroup = {
  // eslint-disable-next-line camelcase
  group_id: number;
  // eslint-disable-next-line camelcase
  name_ru: string;
  // eslint-disable-next-line camelcase
  name_kz: string;
  services: Array<CorrectionService>;
};

type InitialValues = {
  abonent: any;
  group: CorrectionGroup | null;
  service: CorrectionService | null;
  amount: string;
  date: Date;
  reason: string;
};

const initialValues = {
  abonent: null,
  group: null,
  service: null,
  amount: '',
  reason: '',
  date: new Date()
} as InitialValues;

interface Props {
  abonents: Abonent[];
  groups: any;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
}

export const OsiCorrectionForm: React.FC<Props> = observer(({ abonents, groups, onClose, onSubmit }) => {
  const vm = useInjection<IOsiCorrectionFormViewModel>(IOsiCorrectionFormViewModelToken);

  const { translateToken: tt, fieldWithPrefix: fwp } = useTranslation();

  useEffect(() => {
    vm.onSubmitCb = onSubmit;
  }, [onSubmit, vm]);

  useEffect(() => {
    vm.abonents = abonents;
  }, [abonents, vm]);

  const formik = useFormik({
    initialValues,
    validationSchema: CorrectionFormSchema,
    onSubmit: async (values) => {
      await vm.onSubmit(values);

      await queryClient.invalidateQueries({
        queryKey: getGetApiTransactionsSaldoAbonentIdQueryKey(formik.values.abonent?.id)
      });
    }
  });

  useEffect(() => {
    const { group } = formik.values;

    if (!group?.group_id) return;

    const availableServices = group.services;

    if (Array.isArray(availableServices)) {
      vm.services = availableServices;
    } else {
      vm.services = [];
    }
  }, [formik.values.group, vm]);

  const { values, errors, touched, isSubmitting, handleSubmit, setValues, setTouched, getFieldProps } = formik;

  const getAbonents = () => vm.getAbonents(formik.values.group?.group_id ?? 0);

  const renderAbonentItem = (props: any, option: any) => {
    const { flat, name } = option;

    if (!name) {
      return <li {...props}>{`${option.flat}`}</li>;
    }

    if (!flat) {
      return <li {...props}>{`${option.name || ''}`}</li>;
    }

    return <li {...props}>{`${option.flat} - ${option.name || ''}`}</li>;
  };

  const renderGroupItem = (props: any, option: any) => <li {...props}>{`${fwp(option, 'name')}`}</li>;

  const onChangeGroup = async (event: any, value: any) => {
    await formik.setFieldValue('service', null, true);
    await formik.setFieldValue('abonent', null, true);
    if (!value) {
      await formik.setFieldValue('group', null, true);
      return;
    }
    await formik.setFieldValue('group', value, true);
    await formik.validateForm();
  };

  const onChangeAbonent = async (event: any, value: any) => {
    if (!value) {
      await formik.setFieldValue('abonent', null, true);
      return;
    }
    await formik.setFieldValue('service', null, true);
    await formik.setFieldValue('abonent', value, true);

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
                helperText={formik.touched.group && tt(formik.errors.group?.toString() || '')}
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
            options={getAbonents() || []}
            getOptionLabel={(option) => option.flat || ''}
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
                  (touched.abonent && errors.abonent && tt(errors.abonent.toString())) ||
                  (formik.values.group === null && tt(tokens.common.formFields.serviceGroup.validation.need))
                }
              />
            )}
          />
          <Autocomplete
            {...formik.getFieldProps('service')}
            fullWidth
            disableClearable
            disabled={formik.values.group === null}
            options={vm.services}
            getOptionLabel={(option) => fwp(option, 'name') || ''}
            isOptionEqualToValue={(option, value) => option.service_id === value.service_id}
            renderOption={(props, option) => (
              <li {...props} key={option.service_id}>
                {fwp(option, 'name')}
              </li>
            )}
            onChange={async (event, value) => {
              if (!value) {
                await formik.setFieldValue('service', null, true);
                return;
              }
              await formik.setFieldValue('service', value, true);

              await formik.validateForm();
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
                onBlur={() => {
                  formik.setFieldTouched('service');
                }}
                error={Boolean(formik.touched.service && formik.errors.service)}
                helperText={formik.touched.service && formik.errors.service && tt(formik.errors.service.toString())}
              />
            )}
          />
          <MaskInput
            sx={{ mt: 2 }}
            style={{ width: '100%' }}
            label={tt(tokens.common.formFields.sum.label)}
            type="amount"
            align="right"
            allowNegative
            error={Boolean(touched.amount && errors.amount)}
            helperText={(touched.amount && errors.amount && tt(errors.amount.toString())) as string}
            onChange={(e: any) => {
              if (!e.target.value && e.target.value !== '0') setValues({ ...values, amount: '' });
              else setValues({ ...values, amount: e.target.value });
            }}
            onBlur={() => {
              setTouched({ ...touched, amount: true });
            }}
          />
          <TextField
            sx={{ mt: 2 }}
            fullWidth
            label={tt(tokens.common.formFields.reason.label)}
            {...getFieldProps('reason')}
            error={Boolean(touched.reason && errors.reason)}
            helperText={touched.reason && errors.reason && tt(errors.reason.toString())}
          />
          <CalculateDebt />
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

export const CalculateDebt: React.FC = observer(() => {
  const { t } = useTranslation();
  const { values } = useFormikContext<any>();
  const transformData = (saldo: any) => {
    const result = saldo.result?.services?.filter((service: any) => service.serviceId === values.group?.group_id)[0]
      ?.debt;
    return result;
  };

  const {
    data: currentDebt,
    isLoading,
    isPending
  } = useGetApiTransactionsSaldoAbonentId(values.abonent?.id, {
    query: {
      select: transformData
    }
  });

  const resultDebt = (Number(currentDebt) ?? 0) + (Number(values.amount) ?? 0);

  const initialDebtText = () => {
    const debt = Math.round(currentDebt * 100) / 100;
    if (!!currentDebt && currentDebt < 0) return t('payments:currentProfit', { value: Math.abs(debt) });

    if (!currentDebt || Number.isNaN(currentDebt)) return t('payments:currentDebt', { value: 0 });

    return t('payments:currentDebt', { value: debt });
  };

  const resultDebtText = () => {
    const result = Math.round(resultDebt * 100) / 100;
    if (!!resultDebt && resultDebt < 0) return t('payments:resultProfit', { value: Math.abs(result) });

    if (!resultDebt || Number.isNaN(resultDebt)) return t('payments:resultDebt', { value: 0 });

    return t('payments:resultDebt', { value: result });
  };

  if (!values.abonent?.id) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBlockStart: '10px' }}>
      {isPending ? (
        <Typography>{`${t('common:loading')}...`}</Typography>
      ) : (
        <>
          <Typography color={'error'} variant={'subtitle1'}>
            {initialDebtText()}
          </Typography>
          <Typography color={'error'} variant={'subtitle1'}>
            {resultDebtText()}
          </Typography>
          <Typography sx={{ marginBlockStart: '10px' }} variant={'caption'}>
            {t('payments:description')}
          </Typography>
        </>
      )}
    </Box>
  );
});
