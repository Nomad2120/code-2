import { observer } from 'mobx-react-lite';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Typography } from '@mui/material';
import React, { forwardRef, useEffect } from 'react';
import { ServiceNameField } from '@features/osi/accruals/service/add/ui/ServiceNameField';
import { useForm } from 'react-hook-form';
import { Field } from '@shared/components/form/Field';
import { isEmpty } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { additionalServiceSchema, serviceSchema } from '@shared/validation/osi/services';
import { useTranslation } from '@shared/utils/i18n';
import { AddAdditionalServiceFormValues } from '@shared/types/osi/services';
import {
  IAddAdditionalServiceButtonViewModel,
  IAddAdditionalServiceButtonViewModelToken
} from '@shared/types/mobx/features/osiAccruals';
import { useInjection } from 'inversify-react';
import { TransitionProps } from '@mui/material/transitions';
import { SelectArendatorField } from './SelectArendatorField';

interface Props {
  serviceGroupId: number;
  defaultServiceNames: any[];
  reloadCb: any;
}

// @ts-expect-error slide not typed
const Transition = forwardRef<unknown, TransitionProps>((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export const AddAdditionalServiceButton: React.FC<Props> = observer(
  ({ serviceGroupId, defaultServiceNames, reloadCb }) => {
    const vm = useInjection<IAddAdditionalServiceButtonViewModel>(IAddAdditionalServiceButtonViewModelToken);
    const hookForm = useForm<AddAdditionalServiceFormValues>({
      defaultValues: {
        service: {
          code: '',
          nameRu: '',
          nameKz: ''
        },
        serviceGroupId,
        arendator: {
          value: '',
          inputValue: ''
        }
      },
      resolver: yupResolver(additionalServiceSchema),
      mode: 'all'
    });
    const { t, fieldWithPrefix: fwp } = useTranslation();

    useEffect(() => {
      vm.setHookForm(hookForm);
    }, [hookForm, vm]);

    useEffect(() => {
      vm.setReloadCb(reloadCb);
    }, [reloadCb, vm]);

    const {
      control,
      handleSubmit,
      formState: { errors }
    } = hookForm;

    useEffect(() => {
      console.log(errors);
    }, [hookForm.formState.errors]);

    return (
      <>
        <Button
          sx={{ ml: 2 }}
          variant="outlined"
          color="primary"
          startIcon={<LibraryAddIcon />}
          onClick={vm.openDialog}
        >
          <Typography>{t('common:add')}</Typography>
        </Button>
        <Dialog open={vm.isDialogOpen} onClose={vm.closeDialog} TransitionComponent={Transition} fullWidth>
          <DialogTitle sx={{ mb: 2 }}>{t('accruals:addServiceTitle')}</DialogTitle>
          <DialogContent>
            <Box>
              <ServiceNameField control={control} name={'service'} options={defaultServiceNames} />
              <Field
                control={control}
                name={'amount'}
                mask
                required
                fullWidth
                label={t('accruals:tariff')}
                placeholder={`${t('accruals:sumOnMonth')}, ${t('common:tenge')}`}
                InputLabelProps={{ shrink: true }}
                type={'amount'}
                size={'small'}
                sx={{ mb: 2 }}
                style={{ width: '100%' }}
                align="right"
                helperText={errors?.amount?.message ? t(errors.amount.message) : ''}
              />
              <SelectArendatorField control={control} name={'arendator'} osiId={vm.osiId} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={vm.closeDialog}>
              <Typography>{t('common:close')}</Typography>
            </Button>
            <Button
              variant={'contained'}
              disabled={!isEmpty(errors) || vm.isLoading}
              onClick={handleSubmit(vm.onCreateAdditionalServiceClick)}
            >
              <Typography>{t('common:save')}</Typography>
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);
