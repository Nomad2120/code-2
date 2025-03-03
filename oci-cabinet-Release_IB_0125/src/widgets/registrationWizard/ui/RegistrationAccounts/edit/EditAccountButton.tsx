import { observer } from 'mobx-react-lite';
import { Icon } from '@iconify/react';
import editFill from '@iconify-icons/eva/edit-fill';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField
} from '@mui/material';
import { OsiAccount } from '@shared/types/osi';
import { useInjection } from 'inversify-react';
import {
  EditAccountButtonViewModelInterface,
  editAccountButtonViewModelToken
} from '@shared/types/mobx/features/osiAccounts';
import { useAccountsForm } from '@features/osi/accounts/hooks/useAccontsForm';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import { Field } from '@shared/components/form/Field';
import { ChangeEvent, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { isEmpty } from 'lodash';
import { LoadingButton } from '@mui/lab';
import { AccountForm } from '@shared/types/osi/accounts';

interface Props {
  account: OsiAccount;
  editAccountCb: (data: AccountForm & { id: number }) => Promise<void>;
}

export const EditAccountButton: React.FC<Props> = observer(({ account, editAccountCb }) => {
  const vm = useInjection<EditAccountButtonViewModelInterface>(editAccountButtonViewModelToken);
  const { defaultValues, accountTypes, banks } = vm;
  const { form } = useAccountsForm({ defaultValues });
  const { translateToken: tt, t, fieldWithPrefix: fwp } = useTranslation();

  useEffect(() => {
    vm.setForm(form);
  }, [form, vm]);

  useEffect(() => {
    vm.setEditAccountCb(editAccountCb);
  }, [editAccountCb, vm]);

  const {
    control,
    formState: { errors, isSubmitting }
  } = form;

  return (
    <>
      <IconButton onClick={() => vm.onEditAccountClick(account)}>
        <Icon icon={editFill} />
      </IconButton>
      <Dialog open={vm.isDialogOpen} onClose={vm.onCloseDialogClick} maxWidth="md">
        <DialogTitle>
          <TranslatedToken id={tokens.osiInfo.bills.editBill} />
        </DialogTitle>
        <DialogContent>
          <Box minWidth={300}>
            <Field
              sx={{ mt: 2, mb: 2 }}
              select
              fullWidth
              label={tt(tokens.common.formFields.billType.label)}
              control={control}
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={vm.onCloseDialogClick} color="inherit">
            {t('common:cancel')}
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isEmpty(errors)}
            onClick={vm.onSaveAccountClick}
          >
            {t('common:save')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
});
