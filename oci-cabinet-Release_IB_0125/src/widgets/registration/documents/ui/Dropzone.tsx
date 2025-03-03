import { useDropzone } from 'react-dropzone';
import { Box, Typography } from '@mui/material';
import styles from '@widgets/registration/docs/ui/style.module.scss';
import { observer } from 'mobx-react-lite';
import { RequiredDocsResponse } from '@shared/types/registration';
import { IRegistrationDocumentsViewModel } from '@shared/types/mobx/widgets/RegistrationDocuments';
import { fileToScanDoc } from '@shared/utils/files';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';

interface Props {
  doc: RequiredDocsResponse;
  regId: number | undefined;
  vm: IRegistrationDocumentsViewModel;
}

export const Dropzone: React.FC<Props> = observer(({ doc, regId, vm }) => {
  const onDropHandler = async (files: any) => {
    try {
      const scans = await Promise.all(files.map(async (file: File) => fileToScanDoc(file, doc.code)));
      await Promise.all(
        scans.map(async (scan) => {
          await vm.uploadDoc(scan);
        })
      );
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: onDropHandler,
    accept: ['image/*', 'application/pdf']
  });

  return (
    <Box>
      <Box {...getRootProps({ onClick: open })} className={`${styles.dropzone} mb-2`}>
        <input {...getInputProps()} className="hidden" />
        <Typography variant="body1" align={'center'} color={'text.primary'}>
          {doc.nameRu}
          {!doc.isRequired && ' (необязательно)'}
        </Typography>
      </Box>
    </Box>
  );
});
