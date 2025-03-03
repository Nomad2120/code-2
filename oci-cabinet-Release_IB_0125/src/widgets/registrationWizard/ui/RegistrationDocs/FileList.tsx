import { observer } from 'mobx-react-lite';
import { FileItem } from '@widgets/registration/documents/ui/FileItem';
import { useRegistrationDocsContext } from '@widgets/registrationWizard/store/RegistrationDocs/RegistrationDocsProvider';
import { ResponsesRequiredDocsResponse } from '@shared/api/orval/models';
import { Box } from '@mui/material';
import { RegistrationDocFile } from '@shared/types/registration';

interface Props {
  doc: ResponsesRequiredDocsResponse;
}

export const FileList: React.FC<Props> = observer(({ doc }) => {
  const viewModel = useRegistrationDocsContext();
  const docs = viewModel.files.filter((file) => file.docTypeCode === doc.code);

  const deleteDocHandler = async (doc: RegistrationDocFile) => {
    await viewModel.deleteDoc(doc);
  };

  return (
    <Box>
      {docs.map((doc) => (
        <FileItem key={doc.id} doc={doc} onDeleteReady={deleteDocHandler} />
      ))}
    </Box>
  );
});
