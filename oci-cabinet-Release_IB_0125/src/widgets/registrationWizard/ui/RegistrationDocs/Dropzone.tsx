import { useDropzone } from 'react-dropzone';
import { Box, Typography } from '@mui/material';
import styles from '@widgets/registration/docs/ui/style.module.scss';
import { observer } from 'mobx-react-lite';
import { fileToScanDoc } from '@shared/utils/files';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';
import { useRegistrationDocsContext } from '@widgets/registrationWizard/store/RegistrationDocs/RegistrationDocsProvider';
import { ResponsesRequiredDocsResponse } from '@shared/api/orval/models';
import { useTranslation } from '@shared/utils/i18n';

interface Props {
  doc: ResponsesRequiredDocsResponse;
}

export const Dropzone: React.FC<Props> = observer(({ doc }) => {
  const viewModel = useRegistrationDocsContext();
  const { t, fieldWithPrefix: fwp } = useTranslation();
  const onDropHandler = async (files: any) => {
    try {
      const scans = await Promise.all(files.map(async (file: File) => fileToScanDoc(file, doc.code)));
      await Promise.all(
        scans.map(async (scan) => {
          await viewModel.uploadScan(scan);
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
          {fwp(doc, 'name')}
          {!doc.isRequired && ` (${t('common:notRequired')})`}
        </Typography>
      </Box>
    </Box>
  );
});
