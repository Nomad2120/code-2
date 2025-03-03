import { observer } from 'mobx-react-lite';
import { OsiAccountApplicationDoc, OsiAccountApplicationDocFile } from '@shared/types/osiAccountApplications';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { downloadDoc } from '@shared/utils/files';
import { useTranslation } from '@shared/utils/i18n';

interface Props {
  docs: OsiAccountApplicationDoc[];
  file: OsiAccountApplicationDocFile;
}

export const AccountApplicationDocs: React.FC<Props> = observer(({ docs, file }) => {
  const { t, fieldWithPrefix: fwp } = useTranslation();
  return (
    <Box>
      <Typography variant={'subtitle1'}>{t('accountApplications:fullInfo.docs.header')}</Typography>
      <List>
        <ListItem>
          <ListItemAvatar>
            <img
              src={file.preview}
              alt="previewDoc"
              className="w-8 h-8 cursor-pointer"
              onClick={async () => {
                await downloadDoc(file as any);
              }}
            />
          </ListItemAvatar>
          <ListItemText>
            <Typography variant="body1">{fwp(docs[0], 'docTypeName')}</Typography>
          </ListItemText>
        </ListItem>
      </List>
    </Box>
  );
});
