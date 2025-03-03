import { RegistrationDocFile } from '@shared/types/registration';
import { observer } from 'mobx-react-lite';
import { useTranslation } from '@shared/utils/i18n';
import { useEffect, useRef, useState } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { downloadDoc } from '@shared/utils/files';

interface Props {
  onDeleteReady: (doc: RegistrationDocFile) => void;
  doc: RegistrationDocFile;
}

export const FileItem: React.FC<Props> = observer(({ onDeleteReady, doc }) => {
  const { t } = useTranslation();
  const deleteProgressInterval = useRef<any>(null);
  const [deleteProgress, setDeleteProgress] = useState(0);

  const startDeleting = () => {
    if (deleteProgressInterval.current) {
      clearInterval(deleteProgressInterval.current);
    }

    deleteProgressInterval.current = setInterval(() => {
      setDeleteProgress((prev) => prev + 5);
    }, 100);
  };

  const rejectDeleting = () => {
    if (deleteProgressInterval.current) {
      clearInterval(deleteProgressInterval.current);
      setDeleteProgress(0);
    }
  };

  useEffect(() => {
    if (deleteProgress >= 100) {
      onDeleteReady(doc);
      clearInterval(deleteProgressInterval.current);
      setDeleteProgress(0);
    }
  }, [deleteProgress]);

  return (
    <ListItem
      key={doc.id}
      secondaryAction={
        <Tooltip title={t('common:holdForDelete')}>
          <Box className="relative w-[40px] h-[40px]">
            <IconButton
              sx={{ position: 'absolute' }}
              edge="end"
              aria-label="delete"
              onMouseDown={startDeleting}
              onMouseUp={rejectDeleting}
            >
              <DeleteIcon />
            </IconButton>
            {Boolean(deleteProgress) && (
              <CircularProgress variant="determinate" value={deleteProgress} className="absolute z-[-1]" />
            )}
          </Box>
        </Tooltip>
      }
    >
      <ListItemAvatar>
        <img
          src={doc.preview}
          alt="previewDoc"
          className="w-8 h-8 cursor-pointer"
          onClick={async () => {
            await downloadDoc(doc);
          }}
        />
      </ListItemAvatar>
      <ListItemText>
        <Typography variant="body1">{doc.fileName}</Typography>
      </ListItemText>
    </ListItem>
  );
});
