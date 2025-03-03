import { observer } from 'mobx-react-lite';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import api from '@app/api';
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Typography
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GetAppIcon from '@mui/icons-material/GetApp';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import logger from 'js-logger';

interface Props {
  docs: any;
}

export const OsiInfoDocs: React.FC<Props> = observer(({ docs }) => {
  const { t, fieldWithPrefix: fwp } = useTranslation();

  if (!docs || !Array.isArray(docs)) return null;

  const handleDownload = async (doc: any) => {
    try {
      const data = await api.getScanDoc(doc?.scan?.id);
      const fetchData = `data:application/octet-stream;base64,${data}`;
      const a = document.createElement('a');
      a.href = fetchData;
      a.download = doc?.scan?.fileName;
      a.click();
      // eslint-disable-next-line no-empty
    } catch (e) {
      logger.error(e);
      notistackExternal.error();
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        <TranslatedToken id={tokens.osiInfo.mainInfo.docs} />
      </Typography>
      <Box sx={{ width: '100%' }}>
        <List>
          {docs.map((doc, idx) => (
            <ListItem key={`${idx} + ${doc?.docTypeNameRu}`}>
              <ListItemAvatar>
                <Avatar>
                  <InsertDriveFileIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={fwp(doc, 'docTypeName')} secondary={doc?.scan?.fileName} />
              <ListItemSecondaryAction>
                <Tooltip title="Скачать" aria-label="add">
                  <IconButton edge="end" aria-label="download" onClick={() => handleDownload(doc)}>
                    <GetAppIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
});
