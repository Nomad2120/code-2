import { Box, Button, IconButton } from '@mui/material';
import clsx from 'clsx';
import { AccountReportsViewModel } from '@widgets/osi/accountReports/model/viewModel';
import { useFieldArray } from 'react-hook-form';
import { AccountReportListItem } from '@shared/types/osi/accountReports';
import { Field } from '@shared/components/form/Field';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { observer } from 'mobx-react-lite';
import { AllAccountReportsViewModel } from '@widgets/osi/accountReports/allAccountReports/model/viewModel';
import { useTranslation } from 'react-i18next';

interface Props {
  viewModel: AccountReportsViewModel | AllAccountReportsViewModel;
  data: AccountReportListItem;
  itemIndex: number;
  className?: string;
  viewMode?: boolean;
}

export const DetailsGrid: React.FC<Props> = observer(({ viewModel, data, itemIndex, className, viewMode }) => {
  const { fields, append, remove } = useFieldArray({
    control: viewModel.hookForm.control,
    name: `items.${itemIndex}.details`
  });
  const { t } = useTranslation();

  const deleteDetail = (index: number): void => {
    remove(index);
  };

  return (
    <Box className={clsx(['details-grid', className])}>
      <Box className={'header'}>
        <Box className={'cell'}>{t('accountReports:amount')}</Box>
        <Box className={'cell'}>{t('accountReports:comment')}</Box>
      </Box>
      <Box className={'body'}>
        {fields.map((field, index) => (
          <Box key={field.id} className={'row'}>
            <Box className={'cell'}>
              <IconButton onClick={() => deleteDetail(index)} disabled={viewMode}>
                <DeleteForeverIcon />
              </IconButton>
            </Box>
            <Box className={'cell'}>
              <Field
                disabled={viewMode}
                fullWidth
                variant={'standard'}
                key={field.id}
                control={viewModel.hookForm.control}
                name={`items.${itemIndex}.details.${index}.amount`}
              />
            </Box>
            <Box className={'cell'}>
              <Field
                disabled={viewMode}
                fullWidth
                variant={'standard'}
                key={field.id}
                control={viewModel.hookForm.control}
                name={`items.${itemIndex}.details.${index}.comment`}
              />
            </Box>
          </Box>
        ))}
        <Box className={'add-row'}>
          <Button
            disabled={viewMode}
            className={'add-button'}
            variant={'outlined'}
            onClick={() => {
              append({ amount: '', comment: '' });
            }}
          >
            {t('common:add')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
});
