import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { AccountReportsViewModel } from '@widgets/osi/accountReports/model/viewModel';
import { AllAccountReportsViewModel } from '@widgets/osi/accountReports/allAccountReports/model/viewModel';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

interface Props {
  viewModel: AccountReportsViewModel | AllAccountReportsViewModel;
}

export const EditorFilters: React.FC<Props> = observer(({ viewModel }) => {
  const { t } = useTranslation();
  const {
    reportDialog: {
      editorFilters: { checked }
    },
    onFilterChange
  } = viewModel;

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(e.target.checked);
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={changeHandler} size={'small'} />}
        label={t('accountReports:showFilled')}
      />
    </FormGroup>
  );
});
