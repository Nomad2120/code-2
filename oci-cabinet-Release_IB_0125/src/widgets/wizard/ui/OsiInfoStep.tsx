import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { OsiInfoWidgetViewModel, token as OsiInfoWidgetVmToken } from '@shared/types/mobx/widgets/OsiInfoWidget';
import { OsiInfoDocs, OsiInfoForm, useOsiInfoForm } from '@features/osi/info';
import { useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { isEmpty } from 'lodash';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';

interface Props {
  onBackClick: () => void;
  onNextClick: () => void;
}

export const OsiInfoStep: React.FC<Props> = observer(({ onBackClick, onNextClick }) => {
  const { translateToken: tt } = useTranslation();
  const vm = useInjection<OsiInfoWidgetViewModel>(OsiInfoWidgetVmToken);
  const { docs, formValues } = vm;
  const { hookForm } = useOsiInfoForm({ defaultValues: formValues, autoTrigger: false });

  const {
    formState: { errors, isSubmitting, isValid },
    control,
    handleSubmit
  } = hookForm;

  useEffect(() => {
    vm.setHookForm(hookForm);
  }, [hookForm, vm]);

  const saveOsiInfo = async () => {
    await handleSubmit(vm.submitForm)();
    onNextClick();
  };

  const lockedFields = vm.lockedFields.filter((field: string) => field !== 'floors');

  return (
    <Box>
      <OsiInfoForm
        osiUnionTypeName={vm.osiUnionTypeName}
        control={control}
        DocsComponent={<OsiInfoDocs docs={docs} />}
        onSubmit={handleSubmit(vm.submitForm)}
        lockedFields={lockedFields}
      />
      <Box sx={{ mb: 2 }}>
        <Button disabled onClick={onBackClick} sx={{ mt: 1, mr: 1 }}>
          <TranslatedToken id={tokens.common.back} />
        </Button>
        <Button
          type={'submit'}
          variant="contained"
          color="primary"
          onClick={saveOsiInfo}
          sx={{ mt: 1, mr: 1 }}
          disabled={!isEmpty(errors) || isSubmitting || !isValid}
        >
          {tt(tokens.common.next)}
        </Button>
      </Box>
    </Box>
  );
});
