import { observer } from 'mobx-react-lite';
import { Box, DialogContent, Button, Dialog, DialogTitle, MenuItem, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { IAccuralDateViewModel, IAccuralDateViewModelToken } from '@shared/types/mobx/features/OsiAccuralDate';
import { useInjection } from 'inversify-react';
import { useEffect } from 'react';
import { useTranslation } from '@shared/utils/i18n';

interface FormData {
  date: string;
}

export const AccuralDate: React.FC = observer(() => {
  const viewModel = useInjection<IAccuralDateViewModel>(IAccuralDateViewModelToken);
  const hookForm = useForm<FormData>({
    defaultValues: {
      date: '01'
    }
  });
  const { t } = useTranslation();

  const { control, getValues } = hookForm;

  useEffect(() => {
    viewModel.hookForm = hookForm;
  }, [hookForm, viewModel]);

  const onDateChanged = async () => {
    viewModel.onDateChanged();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <Dialog open={viewModel.isModalOpen} onClose={viewModel.closeModal}>
        <DialogTitle sx={{ marginBottom: 2 }}>{t('accruals:accuralDate.dialog.title')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid' }}>
            <Typography sx={{ justifySelf: 'flex-start' }}>
              {t('accruals:accuralDate.dialog.currentDate', { date: viewModel.accuralJobDay })}
            </Typography>
            <Typography sx={{ justifySelf: 'flex-start' }}>
              {t('accruals:accuralDate.dialog.newDate', { date: getValues().date })}
            </Typography>
            <Box sx={{ justifySelf: 'center', marginTop: 2 }}>
              <Typography align={'center'}>{t('common:confirm')}?</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2, gap: 2 }}>
                <Button variant={'outlined'} onClick={viewModel.updatePlanDate}>
                  {t('common:yes')}
                </Button>
                <Button variant={'outlined'} onClick={viewModel.cancelChangeDate}>
                  {t('common:no')}
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <Typography>{t('accruals:accuralDate.currentDate', { date: viewModel.accuralJobDay })}</Typography>
      <Typography>{t('accruals:accuralDate.changeTo')}</Typography>
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t('accruals:accuralDate.selectDayLabel')}
            sx={{ width: '120px' }}
            size="small"
            select
            onChange={async (e) => {
              field.onChange(e.target.value);
              await onDateChanged();
            }}
          >
            {viewModel.allowedDates.map((date) => (
              <MenuItem key={date} value={date}>
                {date}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </Box>
  );
});
