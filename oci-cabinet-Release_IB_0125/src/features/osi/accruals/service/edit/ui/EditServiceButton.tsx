import { observer } from 'mobx-react-lite';
import {
  IEditServiceButtonFeatureViewModel,
  IEditServiceButtonFeatureViewModelToken
} from '@shared/types/mobx/features/osiAccruals';
import { useInjection } from 'inversify-react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Slide,
  TextField,
  Typography
} from '@mui/material';
import { ServiceNameField } from '@features/osi/accruals/service/add/ui/ServiceNameField';
import { Controller, useForm } from 'react-hook-form';
import { Field } from '@shared/components/form/Field';
import React, { forwardRef, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react';
import editFill from '@iconify-icons/eva/edit-fill';
import {
  AccuralMethod,
  EditServiceFormValues,
  OsiServiceResponse,
  ServiceNameExample
} from '@shared/types/osi/services';
import { useTranslation } from '@shared/utils/i18n';
import { DeleteServiceButton } from '@features/osi/accruals/service/delete';
import { serviceSchema } from '@shared/validation/osi/services';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';

interface Props {
  service: OsiServiceResponse;
  accrualMethods: AccuralMethod[];
  defaultServiceNames: ServiceNameExample[];
  reloadCb: () => Promise<void>;
}

// @ts-expect-error slide not typed
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export const EditServiceButton: React.FC<Props> = observer(
  ({ service, accrualMethods, defaultServiceNames, reloadCb }) => {
    const vm = useInjection<IEditServiceButtonFeatureViewModel>(IEditServiceButtonFeatureViewModelToken);

    const isCustomName = () => {
      const status = defaultServiceNames.some((defaultName) => service.nameRu === defaultName.nameRu);

      return !status;
    };

    const hookForm = useForm<EditServiceFormValues & { serviceId: number }>({
      defaultValues: {
        service: {
          code: isCustomName() ? 'custom' : 'default',
          nameRu: service.nameRu ?? '',
          nameKz: service.nameKz ?? ''
        },
        serviceGroupId: service.serviceGroupId,
        accrualMethodId: service.accuralMethodId,
        amount: service.amount,
        serviceId: service.id
      },
      resolver: yupResolver(serviceSchema),
      mode: 'all'
    });
    const { t, fieldWithPrefix: fwp } = useTranslation();

    useEffect(() => {
      vm.setReloadCb(reloadCb);
    }, [reloadCb, vm]);

    useEffect(() => {
      vm.setHookForm(hookForm);
    }, [hookForm, vm]);

    const onEditServiceClick = () => {
      vm.onEditServiceClick(service, isCustomName());
    };

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

    const { isOsiBilling } = service || false;

    return (
      <>
        {!isOsiBilling && (
          <IconButton onClick={onEditServiceClick} disabled={service.isOsiBilling}>
            <Icon icon={editFill} />
          </IconButton>
        )}
        {/* @ts-expect-error transition component not typed */}
        <Dialog open={vm.isDialogOpen} onClose={vm.closeDialog} TransitionComponent={Transition} fullWidth>
          <DialogTitle sx={{ mb: 2 }}>{t('accruals:editServiceTitle')}</DialogTitle>
          <DialogContent>
            <Box>
              <ServiceNameField
                control={control}
                name={'service'}
                options={defaultServiceNames}
                disabled={!isCustomName()}
              />
              <Controller
                control={control}
                name={'accrualMethodId'}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size={'small'}
                    select
                    fullWidth
                    label={t('accruals:accrualMethod')}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
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
            <DeleteServiceButton
              serviceId={service.id}
              content={service.nameRu ?? ''}
              reloadCb={reloadCb}
              onSuccess={vm.closeDialog}
            />
            <Button onClick={vm.closeDialog}>
              <Typography>{t('common:close')}</Typography>
            </Button>
            <Button
              variant={'contained'}
              disabled={!isEmpty(errors) || vm.isLoading}
              onClick={handleSubmit(vm.editService)}
            >
              <Typography>{t('common:save')}</Typography>
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);
