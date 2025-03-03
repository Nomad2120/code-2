import { Box, InputAdornment, OutlinedInput } from '@mui/material';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import { tokens, useTranslation } from '@shared/utils/i18n';
import { OsiListViewModel } from '@widgets/osiList/model';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';

export const OsiListSearchFilter = observer((): JSX.Element => {
  const viewModel = useInjection(OsiListViewModel);
  const { translateToken: tt } = useTranslation();
  const changeHandler = (event: any): void => {
    viewModel.changeFilter(event.target.value);
  };
  return (
    <OutlinedInput
      sx={(theme: any) => ({
        width: 320,
        marginBottom: theme.spacing(2),
        transition: theme.transitions.create(['box-shadow', 'width'], {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.shorter
        }),
        '&.Mui-focused': {
          // width: 320,
          boxShadow: theme.customShadows.z8
        },
        '& fieldset': {
          borderWidth: `1px !important`,
          borderColor: `${theme.palette.grey[500_32]} !important`
        }
      })}
      value={viewModel.filter}
      onChange={changeHandler}
      placeholder={`${tt(tokens.cabinetRoot.findOsi)}...`}
      startAdornment={
        <InputAdornment position="start">
          <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
        </InputAdornment>
      }
      endAdornment={
        viewModel.filter ? (
          <InputAdornment position="end" onClick={() => viewModel.changeFilter('')}>
            <Box component={Icon} icon={closeFill} sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ) : null
      }
    />
  );
});
