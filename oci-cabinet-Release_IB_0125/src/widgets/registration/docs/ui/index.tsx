import { Box, List, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useDropzone } from 'react-dropzone';
import { useInjection } from 'inversify-react';
import { RegistrationDoc } from '@entities/registration/RegistrationDoc';
import { RegistrationDocsViewModel } from '@widgets/registration/docs/model/RegistrationDocsViewModel';
import { useEffect } from 'react';
import styles from './style.module.scss';
import { tokens, TranslatedToken, useTranslation } from '@/shared/utils/i18n';

export const RegistrationDocs = observer((): JSX.Element => {
  const { translateToken: tt } = useTranslation();
  const registrationDocsVM = useInjection(RegistrationDocsViewModel);
  const onDropHandler = (files: any) => {
    registrationDocsVM.onDropFiles(files);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: onDropHandler
  });

  return (
    <Box>
      <Box {...getRootProps({ onClick: open })} className={`${styles.dropzone} mb-2`}>
        <input {...getInputProps()} className="hidden" />
        <Typography variant="body1">
          <TranslatedToken id={tokens.osiRegistration.dragAndDropText} />
        </Typography>
      </Box>
      <Box>
        {registrationDocsVM.isDocsLoading ? (
          'loading...'
        ) : (
          <List dense>
            {registrationDocsVM.docsList.map((doc: any, index: any) => (
              <RegistrationDoc key={`${doc.fileName}+${index}`} doc={doc} />
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
});
