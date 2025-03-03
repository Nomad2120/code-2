import { observer } from 'mobx-react-lite';
import { useRegistrationWizardContext } from '@widgets/registrationWizard/store/RegistrationWizardProvider';
import { useInjection } from 'inversify-react';
import {
  RegistrationDocsViewModel,
  token as IRegistrationDocsViewModelToken
} from '@widgets/registrationWizard/store/RegistrationDocs/RegistrationDocsViewModel';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { Dropzone } from '@widgets/registrationWizard/ui/RegistrationDocs/Dropzone';
import { RegistrationDocsProvider } from '@widgets/registrationWizard/store/RegistrationDocs/RegistrationDocsProvider';
import { ResponsesRequiredDocsResponse } from '@shared/api/orval/models';
import { FileList } from '@widgets/registrationWizard/ui/RegistrationDocs/FileList';
import { WizardButtons } from '@widgets/registrationWizard/ui/RegistrationDocs/WizardButtons';
import LoadingScreen from '@shared/components/LoadingScreen';

export const RegistrationDocs: React.FC = observer(() => {
  const wizard = useRegistrationWizardContext();
  const viewModel = useInjection<RegistrationDocsViewModel>(IRegistrationDocsViewModelToken);

  useEffect(() => {
    viewModel.wizard = wizard;
  }, [viewModel, wizard]);

  useEffect(() => () => viewModel.cleanup(), [viewModel]);

  if (viewModel.isLoading || wizard.isLoading) return <LoadingScreen />;

  return (
    <RegistrationDocsProvider viewModel={viewModel}>
      <Box>
        {viewModel.requiredDocs?.map((requiredDoc: ResponsesRequiredDocsResponse) => (
          <Box key={requiredDoc.code}>
            <Dropzone doc={requiredDoc} />
            <FileList doc={requiredDoc} />
          </Box>
        ))}
      </Box>
      <WizardButtons />
    </RegistrationDocsProvider>
  );
});
