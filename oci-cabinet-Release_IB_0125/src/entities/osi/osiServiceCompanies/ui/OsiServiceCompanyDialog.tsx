import { Box, Button, DialogActions, DialogContent, DialogTitle, MenuItem, Dialog } from '@mui/material';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import { Field } from '@shared/components/form/Field';
import { LoadingButton } from '@mui/lab';
import { isEmpty } from 'lodash';
import { observer } from 'mobx-react-lite';
import { ServiceCompany } from '@shared/types/dictionaries';
import logger from 'js-logger';
import { useEffect } from 'react';
import { OsiServiceCompanyForm } from '@shared/types/osi/osiServiceCompanies';
import { Control, FormState } from 'react-hook-form';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaveClick: () => void;
  serviceCompanyTypes: ServiceCompany[];
  formState: FormState<OsiServiceCompanyForm>;
  control: Control<OsiServiceCompanyForm>;
  title: string;
}

export const OsiServiceCompanyDialog: React.FC<Props> = observer(
  ({ isOpen, title, onClose, onSaveClick, serviceCompanyTypes, formState, control }) => {
    const { translateToken: tt, fieldWithPrefix: fwp } = useTranslation();

    const { errors, isSubmitting } = formState;

    return (
      <Dialog open={isOpen} onClose={onClose} maxWidth="md">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Box minWidth={300}>
            <Field
              required
              sx={{ mt: 2 }}
              select
              fullWidth
              label={tt(tokens.common.formFields.companyType.label)}
              control={control}
              name={'code'}
              error={errors?.code}
              helperText={tt(errors?.code?.message || '')}
            >
              {serviceCompanyTypes?.map((x, index) => (
                <MenuItem key={index} value={x.code}>
                  {fwp(x, 'name')}
                </MenuItem>
              ))}
            </Field>
            <Field
              required
              sx={{ mt: 2 }}
              fullWidth
              label={tt(tokens.common.formFields.phone.label)}
              error={errors?.phones}
              helperText={tt(errors?.phones?.message || '')}
              control={control}
              name={'phones'}
            />
            <Field
              required
              sx={{ mt: 2 }}
              fullWidth
              label={tt(tokens.common.formFields.address.label)}
              error={errors?.addresses}
              helperText={tt(errors?.addresses?.message || '')}
              control={control}
              name={'addresses'}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            <TranslatedToken id={tokens.common.cancel} />
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isEmpty(errors)}
            onClick={onSaveClick}
          >
            <TranslatedToken id={tokens.common.save} />
          </LoadingButton>
        </DialogActions>
      </Dialog>
    );
  }
);
