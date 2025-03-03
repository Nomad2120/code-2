import { observer } from 'mobx-react-lite';
import { DocTypeCodes } from '@shared/types/registration';
import { IRegistrationDocumentsViewModel } from '@shared/types/mobx/widgets/RegistrationDocuments';
import { FileItem } from '@widgets/registration/documents/ui/FileItem';

interface Props {
  docCode: DocTypeCodes | undefined;
  vm: IRegistrationDocumentsViewModel;
}

export const FileList: React.FC<Props> = observer(({ docCode, vm }) => {
  const docs = vm.docs.filter((doc) => doc.docTypeCode === docCode);

  return (
    <>
      {docs.map((doc) => (
        <FileItem
          key={doc.id}
          doc={doc}
          onDeleteReady={async (doc) => {
            console.log(`deleted, ${doc.id}`);
            await vm.deleteDoc(doc);
          }}
        />
      ))}
    </>
  );
});
