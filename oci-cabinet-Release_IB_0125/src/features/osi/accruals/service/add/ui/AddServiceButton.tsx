import { observer } from 'mobx-react-lite';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Slide,
  TextField,
  Typography
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import { useInjection } from 'inversify-react';
import {
  IAddServiceButtonFeatureViewModel,
  IAddServiceButtonFeatureViewModelToken
} from '@shared/types/mobx/features/osiAccruals';
import { Field } from '@shared/components/form/Field';
import { useTranslation } from '@shared/utils/i18n';
import { ServiceNameField } from '@features/osi/accruals/service/add/ui/ServiceNameField';
import { yupResolver } from '@hookform/resolvers/yup';
import { serviceSchema } from '@shared/validation/osi/services';
import { AddServiceFormValues } from '@shared/types/osi/services';
import { isEmpty } from 'lodash';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { OsiServiceAbonentsButton } from '@features/osi/accruals/abonents';
import { RefHandle } from '@features/osi/accruals/abonents/ui/OsiServiceAbonentsButton';

interface Props {
  serviceGroupId: number;
  accrualMethods: any[];
  defaultServiceNames: any[];
  reloadCb: any;
}

// @ts-expect-error slide not typed
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export const AddServiceButton: React.FC<Props> = observer(
  ({ serviceGroupId, accrualMethods, defaultServiceNames, reloadCb }) => {
    const hookForm = useForm<AddServiceFormValues>({
      defaultValues: {
        service: {
          code: '',
          nameRu: '',
          nameKz: ''
        },
        serviceGroupId
      },
      resolver: yupResolver(serviceSchema),
      mode: 'all'
    });
    const { t, fieldWithPrefix: fwp } = useTranslation();
    const vm = useInjection<IAddServiceButtonFeatureViewModel>(IAddServiceButtonFeatureViewModelToken);

    const abonentsTableRef = useRef<RefHandle | null>(null);

    useEffect(() => {
      vm.setHookForm(hookForm);
    }, [hookForm, vm]);

    useEffect(() => {
      vm.setReloadCb(reloadCb);
    }, [reloadCb, vm]);

    useEffect(() => {
      vm.abonentsTableRef = abonentsTableRef;
    }, [vm]);

    const {
      control,
      handleSubmit,
      formState: { errors },
      watch
    } = hookForm;

    const accrualMethodId = watch('accrualMethodId', accrualMethods[0].id);

    const getLabel = useCallback(() => {
      const method = accrualMethods.find((method) => method.id === accrualMethodId);

      if (!method) return '';
      return fwp(method, 'description');
    }, [accrualMethodId, accrualMethods, fwp]);

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
        {/* @ts-expect-error transition component not typed */}
        <Dialog open={vm.isDialogOpen} onClose={vm.closeDialog} TransitionComponent={Transition} fullWidth>
          <DialogTitle sx={{ mb: 2 }}>{t('accruals:addServiceTitle')}</DialogTitle>
          <DialogContent>
            <Box>
              <ServiceNameField control={control} name={'service'} options={defaultServiceNames} />
              <Controller
                control={control}
                name={'accrualMethodId'}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size={'small'}
                    select
                    fullWidth
                    sx={{ mb: 2 }}
                    label={t('accruals:accrualMethod')}
                    InputLabelProps={{ shrink: true }}
                    required
                    error={Boolean(errors?.accrualMethodId)}
                    helperText={errors?.accrualMethodId?.message ? t(errors.accrualMethodId.message) : ''}
                  >
                    {accrualMethods.map((method) => (
                      <MenuItem key={method.id} value={method.id}>
                        {fwp(method, 'description')}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Field
                control={control}
                name={'amount'}
                mask
                required
                fullWidth
                label={`${getLabel()}, ${t('common:tenge')}`}
                InputLabelProps={{ shrink: true }}
                type={'amount'}
                size={'small'}
                style={{ width: '100%' }}
                align="right"
                helperText={errors?.amount?.message ? t(errors.amount.message) : ''}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={vm.closeDialog}>
              <Typography>{t('common:close')}</Typography>
            </Button>
            <Button
              variant={'contained'}
              disabled={!isEmpty(errors) || vm.isLoading}
              onClick={handleSubmit(vm.createService)}
            >
              <Typography>{t('common:save')}</Typography>
            </Button>
          </DialogActions>
        </Dialog>
        <OsiServiceAbonentsButton isButtonHidden reloadCb={reloadCb} ref={abonentsTableRef} />
      </>
    );
  }
);
