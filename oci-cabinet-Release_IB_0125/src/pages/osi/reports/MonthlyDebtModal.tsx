import { observer } from 'mobx-react-lite';
import { DialogTitle, Dialog, DialogContent, Box, DialogActions, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Field } from '@shared/components/form/Field';
import { useTranslation } from '@shared/utils/i18n';
import { useCallback, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { styled } from '@mui/material/styles';

const DialogStyled = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    '& .MuiDialogActions-root': {
      'padding-block': theme.spacing(2),
      'padding-inline': theme.spacing(2)
    }
  },
  '& .MuiDialogTitle-root': {
    'padding-block': theme.spacing(1),
    'padding-inline': theme.spacing(2)
  },
  '& .MuiDialogContent-root': {
    'padding-block': theme.spacing(0.5),
    'padding-inline': theme.spacing(2)
  }
}));

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPublishClicked: (data: any) => void;
}

const validationSchema = yup.object().shape({
  maintenanceAmount: yup.string().required('demo:monthlyDebt.validation.maintenanceAmount.required'),
  savingsAmount: yup.string().required('demo:monthlyDebt.validation.savingsAmount.required'),
  parkingAmount: yup.string().required('demo:monthlyDebt.validation.parkingAmount.required')
});

interface MonthlyDebt {
  maintenanceAmount: number | string;
  savingsAmount: number | string;
  parkingAmount: number | string;
}

const defaultValues: MonthlyDebt = {
  maintenanceAmount: '',
  savingsAmount: '',
  parkingAmount: ''
};

export const MonthlyDebtModal: React.FC<Props> = observer(({ isOpen, onClose, onPublishClicked }) => {
  const { t } = useTranslation();
  const formHook = useForm<MonthlyDebt>({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: 'all'
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger
  } = formHook;

  const validate = useCallback(async () => {
    await trigger();
  }, [trigger]);

  useEffect(() => {
    if (!isOpen) {
      formHook.reset(defaultValues);
      validate();
    }
  }, [formHook, isOpen, validate]);

  useEffect(() => {
    validate();
  }, [trigger, formHook, validate]);

  return (
    <DialogStyled open={isOpen} onClose={onClose} maxWidth={'md'} fullWidth>
      <DialogTitle>{t('demo:monthlyDebt.title')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Field
            type={'number'}
            control={control}
            name={'maintenanceAmount'}
            rules={{ required: true, valueAsNumber: true }}
            label={t('demo:monthlyDebt.maintenanceAmount')}
            error={!!errors.maintenanceAmount?.message}
            helperText={errors.maintenanceAmount?.message ? t(errors.maintenanceAmount.message) : ''}
            required
          />
          <Field
            type={'number'}
            control={control}
            name={'savingsAmount'}
            rules={{ required: true, valueAsNumber: true }}
            label={t('demo:monthlyDebt.savingsAmount')}
            error={!!errors.savingsAmount}
            helperText={errors.savingsAmount?.message ? t(errors.savingsAmount.message) : ''}
            required
          />
          <Field
            type={'number'}
            control={control}
            name={'parkingAmount'}
            rules={{ required: true, valueAsNumber: true }}
            label={t('demo:monthlyDebt.parkingAmount')}
            error={!!errors.parkingAmount}
            helperText={errors.parkingAmount?.message ? t(errors.parkingAmount.message) : ''}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common:cancel')}</Button>
        <Button
          disabled={Boolean(Object.keys(errors).length)}
          onClick={handleSubmit((data) => {
            onPublishClicked(data);
          })}
        >
          {t('accountReports:publish')}
        </Button>
      </DialogActions>
    </DialogStyled>
  );
});
