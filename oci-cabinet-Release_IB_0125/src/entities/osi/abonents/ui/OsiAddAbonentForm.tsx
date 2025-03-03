import { useFormik } from 'formik';
import { Autocomplete, Box, Button, Grid, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { camelCase, get as _get, isEmpty, replace as _replace } from 'lodash';
import { useEffect } from 'react';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import { formatPhone } from '@shared/utils/helpers/formatString';
import { AbonentSchema } from '@shared/validation/osi/abonents';
import { AreaType } from '@shared/types/dictionaries';
import MaskInput from '@shared/common/MaskInput';
import api from '@app/api';
import notistack from '@shared/utils/helpers/notistackExternal';
import { observer } from 'mobx-react-lite';

enum OwnerCode {
  Owner,
  Arendator
}

type OwnerType = {
  code: OwnerCode;
  nameRu: string;
  nameKz: string;
};

const ownerTypes: OwnerType[] = [
  {
    code: OwnerCode.Owner,
    nameRu: 'Собственник',
    nameKz: 'меншік иесі'
  },
  {
    code: OwnerCode.Arendator,
    nameRu: 'Арендатор',
    nameKz: 'жалға алушы'
  }
];

interface Props {
  data?: any;
  onClose: any;
  totalAbonents: number;
  osiId: number | null;
  areaTypes: AreaType[];
}

export const OsiAddAbonentForm: React.FC<Props> = observer(({ data, onClose, totalAbonents, osiId, areaTypes }) => {
  const { translateToken: tt, fieldWithPrefix: fwp } = useTranslation();

  const isCreate = !data;

  const initialModel = {
    // eslint-disable-next-line no-unsafe-optional-chaining
    flat: data?.flat || (totalAbonents ? `${totalAbonents + 1}` : '').toString(),
    name: data?.name || '',
    idn: data?.idn || '',
    phone: formatPhone(data?.phone) || '',
    areaTypeCode: data?.areaTypeCode || (areaTypes?.length ? areaTypes[0]?.code : ''),
    floor: String(data?.floor || ''),
    square: String(data?.square || ''),
    effectiveSquare: data?.effectiveSquare || '',
    livingJur: String(data?.livingJur || ''),
    livingFact: String(data?.livingFact || ''),
    owner: ownerTypes.find((types) => types.nameRu === data?.owner) || '',
    id: data?.id,
    external: data?.external || false
  };

  const formik = useFormik({
    initialValues: initialModel,
    validationSchema: AbonentSchema,
    onSubmit: (values) => {
      console.log(values);
    }
  });

  const { values, getFieldProps, touched, setValues, errors, setTouched, setErrors, isSubmitting, setSubmitting } =
    formik;

  useEffect(() => {
    formik.validateForm().then((errors) => {
      Object.keys(errors).forEach((key) => {
        formik.setFieldTouched(key, true, true);
      });
    });
  }, []);

  const handleAbonentUpdate = async (data: any, setErrors: any, setSubmitting: any) => {
    const values = {
      phone: _replace(_replace(data.phone, '+7 7', '7'), new RegExp(' ', 'g'), ''),
      floor: data.floor ? parseInt(data.floor, 10) : 0,
      livingJur: data.livingJur ? parseInt(data.livingJur, 10) : 0,
      livingFact: data.livingFact ? parseInt(data.livingFact, 10) : 0,
      square: data.square ? parseFloat(data.square) : 0,
      effectiveSquare: data.effectiveSquare ? parseFloat(data.effectiveSquare) : 0,
      flat: data.flat,
      name: data.name,
      idn: data.idn,
      owner: data.owner.nameRu,
      areaTypeCode: data.areaTypeCode,
      external: data.external,
      osiId: osiId ?? ''
    };

    try {
      if (isCreate) {
        await api.AbonentCreate(values);
      } else {
        await api.AbonentEdit(data.id, values);
      }

      notistack.success('Сохранено');
      onClose(true);
    } catch (err: any) {
      const errors = _get(err, ['response', 'data', 'errors']);
      if (isEmpty(errors)) {
        notistack.error(err.toString());
      } else {
        const formikErrors = {} as Record<any, any>;
        Object.keys(errors).forEach((key) => {
          formikErrors[camelCase(key)] = errors[key];
        });

        setErrors({ ...formikErrors });
      }
      setSubmitting(false);
    }
  };

  const idx = areaTypes.findIndex((x: any) => x.code === values.areaTypeCode);
  const ownerIndex = ownerTypes.findIndex((x) => x.code === (values.owner as OwnerType)?.code);

  return (
    <>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={3} sm={2}>
          <TextField
            fullWidth
            label={tt(tokens.common.formFields.number.label)}
            inputProps={{ style: { textAlign: 'center' } }}
            {...getFieldProps('flat')}
            error={Boolean(touched.flat && errors.flat)}
            helperText={(touched.flat && errors.flat && tt(errors.flat.toString())) as string}
          />
        </Grid>
        <Grid item xs={9} sm={4}>
          <Autocomplete
            fullWidth
            disableClearable
            getOptionLabel={(option) => fwp(option, 'name')}
            renderOption={(props, option) => <li {...props}>{fwp(option, 'name')}</li>}
            options={areaTypes}
            onChange={(event, value) => {
              if (!value) {
                setValues({
                  ...values,
                  areaTypeCode: ''
                });
              } else {
                setValues({
                  ...values,
                  areaTypeCode: value.code
                });
              }
            }}
            value={areaTypes[idx]}
            renderInput={(params) => (
              <TextField
                {...params}
                label={tt(tokens.common.formFields.flatType.label)}
                margin="normal"
                InputProps={{
                  ...params.InputProps,
                  autoComplete: 'new-password'
                }}
                onBlur={() => {
                  setTouched({
                    ...touched,
                    areaTypeCode: true
                  });
                }}
                error={Boolean(touched.areaTypeCode && errors.areaTypeCode)}
                helperText={
                  (touched.areaTypeCode && errors.areaTypeCode && tt(errors.areaTypeCode.toString())) as string
                }
                style={{ margin: 0 }}
              />
            )}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <MaskInput
            label={tt(tokens.common.formFields.floor.label)}
            mask="##"
            align="right"
            error={Boolean(touched.floor && errors.floor)}
            helperText={(touched.floor && errors.floor && tt(errors.floor.toString())) as string}
            {...getFieldProps('floor')}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <MaskInput
            label={tt(tokens.common.formFields.square.label)}
            type="amount"
            align="right"
            maxLimit={9999.99}
            error={Boolean(touched.square && errors.square)}
            helperText={(touched.square && errors.square && tt(errors.square.toString())) as string}
            {...getFieldProps('square')}
            onChange={(e) => {
              setValues({ ...values, square: e.target.value });
            }}
            onBlur={() => {
              setTouched({ ...touched, square: true });
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={3}>
          <MaskInput
            label={tt(tokens.common.formFields.effectiveSquare.label)}
            type="amount"
            align="right"
            maxLimit={9999.99}
            error={Boolean(touched.effectiveSquare && errors.effectiveSquare)}
            helperText={
              (touched.effectiveSquare && errors.effectiveSquare && tt(errors.effectiveSquare.toString())) as string
            }
            {...getFieldProps('effectiveSquare')}
            onChange={(e) => {
              setValues({ ...values, effectiveSquare: e.target.value });
            }}
            onBlur={() => {
              setTouched({ ...touched, effectiveSquare: true });
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <MaskInput
            label={tt(tokens.common.formFields.iin.label)}
            mask="############"
            error={Boolean(touched.idn && errors.idn)}
            helperText={(touched.idn && errors.idn && tt(errors.idn.toString())) as string}
            {...getFieldProps('idn')}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <MaskInput
            mask="+7 7## ### ## ##"
            label={tt(tokens.common.formFields.phone.label)}
            {...getFieldProps('phone')}
            error={Boolean(touched.phone && errors.phone)}
            helperText={(touched.phone && errors.phone && tt(errors.phone.toString())) as string}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={tt(tokens.common.formFields.owner.label)}
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={(touched.name && errors.name && tt(errors.name.toString())) as string}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Autocomplete
            fullWidth
            disableClearable
            getOptionLabel={(option) => fwp(option, 'name')}
            renderOption={(props, option) => <li {...props}>{fwp(option, 'name')}</li>}
            options={ownerTypes}
            onChange={(event, value) =>
              setValues({
                ...values,
                owner: value || ''
              })
            }
            value={ownerTypes[ownerIndex] || undefined}
            renderInput={(params) => (
              <TextField
                {...params}
                label={tt(tokens.common.formFields.owner.labelAlt)}
                margin="normal"
                InputProps={{
                  ...params.InputProps,
                  autoComplete: 'new-password'
                }}
                onBlur={() => {
                  setTouched({
                    ...touched,
                    owner: true
                  });
                }}
                error={Boolean(touched.owner && errors.owner)}
                helperText={(touched.owner && errors.owner && tt(errors.owner.toString())) as string}
                style={{ margin: 0 }}
              />
            )}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <MaskInput
            label={tt(tokens.common.formFields.livingFact.label)}
            mask="###"
            align="right"
            error={Boolean(touched.livingFact && errors.livingFact)}
            helperText={(touched.livingFact && errors.livingFact && tt(errors.livingFact.toString())) as string}
            {...getFieldProps('livingFact')}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <MaskInput
            label={tt(tokens.common.formFields.livingJur.label)}
            mask="###"
            align="right"
            error={Boolean(touched.livingJur && errors.livingJur)}
            helperText={(touched.livingJur && errors.livingJur && tt(errors.livingJur.toString())) as string}
            {...getFieldProps('livingJur')}
          />
        </Grid>
        <Box
          width="100%"
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <Button
            onClick={() => {
              onClose(false);
            }}
            color="inherit"
            sx={{ mr: 1 }}
            size="large"
          >
            <TranslatedToken id={tokens.common.cancel} />
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isEmpty(errors)}
            size="large"
            onClick={() => {
              handleAbonentUpdate(values, setErrors, setSubmitting);
            }}
          >
            <TranslatedToken id={tokens.common.save} />
          </LoadingButton>
        </Box>
      </Grid>
    </>
  );
});
