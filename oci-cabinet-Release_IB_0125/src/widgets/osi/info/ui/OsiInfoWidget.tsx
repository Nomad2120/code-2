import { observer } from 'mobx-react-lite';
import { OsiInfoForm, OsiInfoSaveButton, OsiInfoDocs, useOsiInfoForm } from '@features/osi/info';
import { Box } from '@mui/material';
import { isEmpty } from 'lodash';
import { OsiInfoWidgetViewModel, token as OsiInfoWidgetVmToken } from '@shared/types/mobx/widgets/OsiInfoWidget';
import { useInjection } from 'inversify-react';
import { useEffect } from 'react';

export const OsiInfoWidget: React.FC = observer(() => {
  const vm = useInjection<OsiInfoWidgetViewModel>(OsiInfoWidgetVmToken);
  const { docs, formValues } = vm;
  const { hookForm } = useOsiInfoForm({ defaultValues: formValues });

  const {
    formState: { errors, isSubmitting },
    control,
    handleSubmit
  } = hookForm;

  useEffect(() => {
    vm.setHookForm(hookForm);
  }, [hookForm, vm]);

  // Убрать из визарда шаг с сервисными компаниями - оставить только в ОСИ

  return (
    <Box>
      <OsiInfoForm
        lockedFields={vm.lockedFields}
        osiUnionTypeName={vm.osiUnionTypeName}
        control={control}
        SaveButtonComponent={<OsiInfoSaveButton loading={isSubmitting} disabled={!isEmpty(errors)} />}
        DocsComponent={<OsiInfoDocs docs={docs} />}
        onSubmit={handleSubmit(vm.submitForm)}
      />
    </Box>
  );
});
