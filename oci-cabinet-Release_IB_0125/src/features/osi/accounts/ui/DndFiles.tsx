import { observer } from 'mobx-react-lite';
import { useTranslation } from '@shared/utils/i18n';
import { useController, useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { OsiAccountTypes } from '@shared/types/osi/accounts';
import { DocTypeCodes } from '@shared/types/registration';
import { createImgFile, createPdfFile, createPreview, fileToScanDoc } from '@shared/utils/files';
import { useDropzone } from 'react-dropzone';
import { Box, Typography } from '@mui/material';
import clsx from 'clsx';
import styles from '@widgets/registration/docs/ui/style.module.scss';

export const DndFiles: React.FC = observer(() => {
  const { t } = useTranslation();
  const { control, getValues, watch } = useFormContext();
  const { field } = useController({ control, name: 'file' });
  const [docFile, setDocFile] = useState<{ preview: string; name: string } | null>(null);

  const accountType = watch('accountType');
  const onDropHandler = async (files: any) => {
    if (!files.length) return;

    const { accountType } = getValues();

    const docTypeCode =
      accountType === OsiAccountTypes.CURRENT ? DocTypeCodes.CURRENT_IBAN_INFO : DocTypeCodes.SAVING_IBAN_INFO;

    const file = files[0];
    const fileScan = await fileToScanDoc(file, docTypeCode);
    let doc;
    if (fileScan.extension === 'pdf') {
      doc = await createPdfFile(fileScan.data, file.name);
    } else {
      doc = await createImgFile(fileScan.data, file.name);
    }
    setDocFile({
      preview: createPreview(doc),
      name: file.name
    });
    field.onChange(fileScan);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    onDrop: onDropHandler,
    accept: ['image/*', 'application/pdf']
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {field.value ? (
        <Box sx={{ display: 'flex', columnGap: '10px', alignItems: 'center' }}>
          <img src={docFile?.preview} alt="previewDoc" className="w-8 h-8" />
          <Typography color={'text.primary'}>{docFile?.name}</Typography>
        </Box>
      ) : (
        <Box
          {...getRootProps({
            onClick: accountType ? open : () => {}
          })}
          className={clsx(['mb-2', styles.dropzone, !accountType && styles.disabled])}
        >
          <input {...getInputProps()} className="hidden" />
          <Typography variant="body1" color={'text.primary'} align={'center'}>
            {t('accountApplications:fullInfo.docs.attach.dndText')}
          </Typography>
        </Box>
      )}
    </Box>
  );
});
