import { Checkbox, FormControlLabel } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { IOsiServiceAbonentsButtonFeatureViewModel } from '@shared/types/mobx/features/osiAccruals';
import { AreaTypeCodes } from '@shared/types/dictionaries';
import { useGridApiContext } from '@mui/x-data-grid-pro';

interface Props {
  label: string;
  type: AreaTypeCodes;
  viewModel: IOsiServiceAbonentsButtonFeatureViewModel;
}

export const QuickSelector: React.FC<Props> = observer(({ label, type, viewModel }) => {
  const selectorState = viewModel.selectorStateByType(type);
  const apiRef = useGridApiContext();

  viewModel.apiRef = apiRef;

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      viewModel.selectByType(type);
      return;
    }
    viewModel.unselectByType(type);
  };

  return <FormControlLabel control={<Checkbox onChange={changeHandler} {...selectorState} />} label={label} />;
});
