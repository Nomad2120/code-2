import {
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Avatar,
  IconButton,
  Tooltip,
  Box
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GetAppIcon from '@mui/icons-material/GetApp';

import { observer } from 'mobx-react-lite';
import api from '../../../app/api';

interface Props {
  docs: any;
}

const DocList: React.FC<Props> = observer(({ docs }) => {
  const handleDownload = async (doc: any) => {
    try {
      const data = await api.getScanDoc(doc?.scan?.id);
      const fetchData = `data:application/octet-stream;base64,${data}`;
      const a = document.createElement('a');
      a.href = fetchData;
      a.download = doc?.scan?.fileName;
      a.click();
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Документы
      </Typography>
      <Box sx={{ width: '100%' }}>
        <List>
          {docs &&
            docs.map((doc: any, idx: number) => (
              <ListItem key={`${idx} + ${doc?.docTypeNameRu}`}>
                <ListItemAvatar>
                  <Avatar>
                    <InsertDriveFileIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={doc?.docTypeNameRu} secondary={doc?.scan?.fileName} />
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

export default DocList;
