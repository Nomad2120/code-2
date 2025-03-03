import { observer } from 'mobx-react-lite';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField
} from '@mui/material';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import { Field } from '@shared/components/form/Field';
import { ChangeEvent } from 'react';
import { Controller, UseFormReturn, useFormState } from 'react-hook-form';
import { isEmpty } from 'lodash';
import { LoadingButton } from '@mui/lab';
import { AccountForm } from '@shared/types/osi/accounts';
import { AccountType, Bank } from '@shared/types/dictionaries';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<AccountForm>;
  banks: Bank[];
  accountTypes: AccountType[];
  onSaveClick: () => void;
  onChangeAccount: (e: any) => Promise<void> | void;
}

export const AddAccountDialog: React.FC<Props> = observer(
  ({ isOpen, onClose, form, banks, accountTypes, onSaveClick, onChangeAccount }) => {
    const { translateToken: tt, t, fieldWithPrefix: fwp } = useTranslation();

    const { control } = form;

    const { isValid, isSubmitting, errors } = useFormState({ control });

    return (
      <Dialog open={isOpen} onClose={onClose} maxWidth="md">
        <DialogTitle>
          <TranslatedToken id={tokens.osiInfo.bills.addBill} />
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
              disabled
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
                void onChangeAccount(e.target.value);
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
          <Button onClick={onClose} color="inherit">
            {t('common:cancel')}
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isValid}
            onClick={onSaveClick}
          >
            {t('common:save')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    );
  }
);
