import { observer } from 'mobx-react-lite';
import { IOsiAccountApplicationsWidgetViewModel } from '@shared/types/mobx/widgets/OsiAccountApplications';
import { useDropzone } from 'react-dropzone';
import { Box, Typography } from '@mui/material';
import styles from '@widgets/registration/docs/ui/style.module.scss';
import { useTranslation } from '@shared/utils/i18n';

interface Props {
  vm: IOsiAccountApplicationsWidgetViewModel;
}

export const DnDApplicationDoc: React.FC<Props> = observer(({ vm }) => {
  const { t } = useTranslation();
  const onDropHandler = (files: any) => {
    if (!files.length) return;

    vm.attachDocument(files[0]);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    onDrop: onDropHandler,
    accept: ['image/*', 'application/pdf']
  });

  return (
    <Box>
      <Typography variant={'subtitle1'}>{t('accountApplications:fullInfo.docs.attach.header')}</Typography>
      <Box {...getRootProps({ onClick: open })} className={`${styles.dropzone} mb-2`}>
        <input {...getInputProps()} className="hidden" />
        <Typography variant="body1">{t('accountApplications:fullInfo.docs.attach.dndText')}</Typography>
      </Box>
    </Box>
  );
});
