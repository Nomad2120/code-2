import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Tooltip
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { isEmpty } from 'lodash';
import { observer } from 'mobx-react-lite';
import { ChangeEvent, useEffect } from 'react';
import {
  AddAccountButtonViewModelInterface,
  addAccountButtonViewModelToken
} from '@shared/types/mobx/features/osiAccounts';
import { useInjection } from 'inversify-react';
import { Field } from '@shared/components/form/Field';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { AccountFormWithFile } from '@shared/types/osi/accounts';
import { yupResolver } from '@hookform/resolvers/yup';
import { AccountSchema } from '@shared/validation/osi/accounts';
import * as yup from 'yup';
import { DndFiles } from '@features/osi/accounts/ui/DndFiles';
import { OsiAccount } from '@shared/types/osi';

const schema = AccountSchema.concat(
  yup.object().shape({
    file: yup.mixed().required('Файл обязателен для загрузки')
  })
);

interface Props {
  addAccountCb: (data: AccountFormWithFile) => void;
  disabled?: boolean;
  accounts?: OsiAccount[];
}

export const AddAccountButton: React.FC<Props> = observer(({ addAccountCb, disabled = false, accounts }) => {
  const vm = useInjection<AddAccountButtonViewModelInterface>(addAccountButtonViewModelToken);
  const { defaultValues, banks, accountTypes, isCurrentAccountExists } = vm;
  const form = useForm<AccountFormWithFile>({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'all'
  });
  const { translateToken: tt, t, fieldWithPrefix: fwp } = useTranslation();

  const {
    control,
    formState: { isSubmitting, errors, isValid }
  } = form;

  useEffect(() => {
    vm.setForm(form);
  }, [form, vm]);

  useEffect(() => {
    vm.setFeatureStatus(disabled);
  }, [disabled, vm]);

  useEffect(() => {
    vm.setAddAccountCb(addAccountCb);
  }, [vm, addAccountCb]);

  useEffect(() => {
    vm.accounts = accounts ?? [];
  }, [vm, accounts]);

  const isAllAccountsFilled = accounts?.length && accounts?.length >= 2;

  if (isAllAccountsFilled) return null;

  return (
    <>
      <Tooltip title={vm.isFeatureDisabled ? 'Для добавления счета обратитесь к оператору' : ''}>
        <Button
          sx={{
            ml: 2,
            '&.Mui-disabled': {
              pointerEvents: 'all'
            }
          }}
          variant="outlined"
          color="primary"
          startIcon={<LibraryAddIcon />}
          disabled={vm.isFeatureDisabled}
          onClick={vm.onAddAccountClick}
        >
          <TranslatedToken id={tokens.common.add} />
        </Button>
      </Tooltip>

      <Dialog open={vm.isDialogOpen} onClose={vm.onCloseDialogClick} maxWidth="xs" fullWidth>
        <DialogTitle>
          <TranslatedToken id={tokens.osiInfo.bills.addBill} />
        </DialogTitle>
        <DialogContent>
          <FormProvider {...form}>
            <Box minWidth={300}>
              <Field
                sx={{ mt: 2, mb: 2 }}
                select
                fullWidth
                label={tt(tokens.common.formFields.billType.label)}
                control={control}
                disabled={isCurrentAccountExists}
                name={'accountType'}
                required
                data-test-id={'bill-type'}
                error={errors?.accountType}
                helperText={tt(errors?.accountType?.message || '')}
              >
                {accountTypes?.map((x, index) => (
                  <MenuItem key={index} value={x.code}>
                    {fwp(x, 'name')}
                  </MenuItem>
                ))}
              </Field>
              <Field
                required
                name={'account'}
                control={control}
                mask={/^[A-Za-z0-9]{1,20}$/}
                label={tt(tokens.common.formFields.bill.label)}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  vm.onChangeAccount(e.target.value);
                }}
              />
              <Controller
                control={control}
                name={'bank'}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
                  const helperText = tt((error as unknown as any)?.bic?.message);
                  return (
                    <Autocomplete
                      size={'small'}
                      fullWidth
                      getOptionLabel={(option) => option.bic || ''}
                      isOptionEqualToValue={(option, value) => option.bic === value.bic}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <span>{`${option.bic} - ${option.name}`}</span>
                        </li>
                      )}
                      options={banks}
                      onChange={(e, data) => onChange(data)}
                      value={value}
                      renderInput={(params) => (
                        <TextField
                          required
                          {...params}
                          label={tt(tokens.common.formFields.IDNBank.label)}
                          margin="normal"
                          InputLabelProps={{
                            shrink: true
                          }}
                          InputProps={{
                            ...params.InputProps,
                            autoComplete: 'new-password'
                          }}
                          onBlur={onBlur}
                          error={!isEmpty(error)}
                          helperText={helperText}
                        />
                      )}
                    />
                  );
                }}
              />
              <Box sx={{ marginBlockStart: '20px' }}>
                <DndFiles />
              </Box>
            </Box>
          </FormProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={vm.onCloseDialogClick} color="inherit">
            {t('common:cancel')}
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isValid}
            onClick={vm.onSaveAccountClick}
          >
            {t('common:save')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
});
