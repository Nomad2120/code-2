import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import {
  IRegistrationDocumentsViewModel,
  RegistrationDocumentsViewModelToken
} from '@shared/types/mobx/widgets/RegistrationDocuments';
import { useEffect } from 'react';
import LoadingScreen from '@shared/components/LoadingScreen';
import { Box } from '@mui/material';
import { Dropzone } from '@widgets/registration/documents/ui/Dropzone';
import { FileList } from '@widgets/registration/documents/ui/FileList';

interface Props {
  onDocsUpdated: (isRequiredDocsFilled: boolean) => void;
}

export const RegistrationDocuments: React.FC<Props> = observer(({ onDocsUpdated }) => {
  const vm = useInjection<IRegistrationDocumentsViewModel>(RegistrationDocumentsViewModelToken);

  useEffect(() => {
    onDocsUpdated(vm.isRequiredDocsFilled);
  }, [vm.isRequiredDocsFilled]);

  if (vm.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      {vm.reqdocs.map((doc) => (
        <Box key={(doc?.code ?? '') + Math.random().toString()}>
          <Dropzone key={doc.code} doc={doc} regId={vm.regId} vm={vm} />
          <FileList docCode={doc.code} vm={vm} />
        </Box>
      ))}
    </div>
  );
});
