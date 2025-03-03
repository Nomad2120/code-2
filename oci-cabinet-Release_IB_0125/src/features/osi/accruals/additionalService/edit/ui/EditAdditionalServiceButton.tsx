import { observer } from 'mobx-react-lite';
import { AddAdditionalServiceFormValues, OsiServiceResponse, ServiceNameExample } from '@shared/types/osi/services';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@shared/utils/i18n';
import React, { forwardRef, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Typography
} from '@mui/material';
import { Icon } from '@iconify/react';
import editFill from '@iconify-icons/eva/edit-fill';
import { ServiceNameField } from '@features/osi/accruals/service/add/ui/ServiceNameField';
import { Field } from '@shared/components/form/Field';
import { SelectArendatorField } from '@features/osi/accruals/additionalService/add/ui/SelectArendatorField';
import { isEmpty } from 'lodash';
import {
  IEditAdditionalServiceFeatureViewModel,
  IEditAdditionalServiceFeatureViewModelToken
} from '@shared/types/mobx/features/osiAccruals';
import { useInjection } from 'inversify-react';
import { TransitionProps } from '@mui/material/transitions';
import { DeleteServiceButton } from '@features/osi/accruals/service/delete';
import { additionalServiceSchema } from '@shared/validation/osi/services';
import { yupResolver } from '@hookform/resolvers/yup';

interface Props {
  service: OsiServiceResponse;
  defaultServiceNames: ServiceNameExample[];
  reloadCb: () => Promise<void>;
}

// @ts-expect-error slide not typed
const Transition = forwardRef<unknown, TransitionProps>((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export const EditAdditionalServiceButton: React.FC<Props> = observer(({ service, defaultServiceNames, reloadCb }) => {
  const vm = useInjection<IEditAdditionalServiceFeatureViewModel>(IEditAdditionalServiceFeatureViewModelToken);
  const hookForm = useForm<AddAdditionalServiceFormValues>({
    defaultValues: {
      service: {
        code: '',
        nameRu: '',
        nameKz: ''
      },
      serviceGroupId: 7,
      arendator: {
        value: '',
        inputValue: ''
      }
    },
    resolver: yupResolver(additionalServiceSchema),
    mode: 'all'
  });
  const { t, fieldWithPrefix: fwp } = useTranslation();

  const isCustomName = () => {
    const status = defaultServiceNames.some((defaultName) => service.nameRu === defaultName.nameRu);

    return !status;
  };
  const onEditServiceClick = () => {
    vm.onEditServiceClick(service, isCustomName());
  };

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

  const { isOsiBilling } = service || false;

  return (
    <>
      {!isOsiBilling && (
        <IconButton onClick={onEditServiceClick} disabled={service.isOsiBilling}>
          <Icon icon={editFill} />
        </IconButton>
      )}
      <Dialog open={vm.isDialogOpen} onClose={vm.closeDialog} TransitionComponent={Transition} fullWidth>
        <DialogTitle sx={{ mb: 2 }}>{t('accruals:editServiceTitle')}</DialogTitle>
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
            <SelectArendatorField control={control} name={'arendator'} osiId={vm.osiId} disabled />
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
            onClick={handleSubmit(vm.onSubmitEditServiceClick)}
          >
            <Typography>{t('common:save')}</Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
