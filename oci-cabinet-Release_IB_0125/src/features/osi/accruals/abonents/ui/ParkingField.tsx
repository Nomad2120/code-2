import { observer } from 'mobx-react-lite';
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid-pro';
import { TextField } from '@mui/material';
import { IOsiServiceAbonentsButtonFeatureViewModel } from '@shared/types/mobx/features/osiAccruals';
import { useLayoutEffect, useRef } from 'react';

interface Props extends GridRenderEditCellParams {
  viewModel: IOsiServiceAbonentsButtonFeatureViewModel;
}

export const ParkingField: React.FC<Props> = observer(({ value, field, id, hasFocus, viewModel, error }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const apiRef = useGridApiContext();

  useLayoutEffect(() => {
    if (hasFocus) inputRef.current?.focus();
  }, [hasFocus]);

  viewModel.apiRef = apiRef;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    apiRef.current.setEditCellValue({ id, field: 'parkingPlaces', value: e.target.value });
  };

  console.log('edit error', error);

  return (
    <TextField
      sx={{
        '& .Mui-error': {
          bgcolor: 'error.main'
        }
      }}
      error={error}
      inputRef={inputRef}
      variant="standard"
      type="number"
      autoFocus
      fullWidth
      size="small"
      hiddenLabel
      value={value}
      onChange={handleChange}
    />
  );
});
