import { observer } from 'mobx-react-lite';
import { tokens, useTranslation } from '@shared/utils/i18n';
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
import { RegistrationDocsViewModel } from '@widgets/registration/docs/model/RegistrationDocsViewModel';
import { RegistrationDocViewModel } from '@entities/registration/RegistrationDoc/model/RegistrationDocViewModel';
import { useInjection } from 'inversify-react';
import { useEffect } from 'react';

interface Props {
  doc: any;
}

export const RegistrationDoc = observer(({ doc }: Props): JSX.Element => {
  const vm = useInjection(RegistrationDocViewModel);
  const { translateToken: tt } = useTranslation();

  useEffect(() => {
    vm.setDoc(doc);
  }, [doc, vm]);

  return (
    <ListItem
      secondaryAction={
        <Tooltip title={tt(tokens.osiRegistration.holdForDelete)}>
          <Box className="relative w-[40px] h-[40px]">
            <IconButton
              sx={{ position: 'absolute' }}
              edge="end"
              aria-label="delete"
              onMouseDown={() => vm.startDeleteProcess()}
              onMouseUp={() => vm.resetDeleteProcess()}
            >
              <DeleteIcon />
            </IconButton>
            {vm.isDeletingProcess && (
              <CircularProgress variant="determinate" value={vm.deleteProgress} className="absolute z-[-1]" />
            )}
          </Box>
        </Tooltip>
      }
    >
      <ListItemAvatar>
        <img src={doc.preview} alt="previewDoc" className="w-8 h-8 cursor-pointer" onClick={() => vm.downloadDoc()} />
      </ListItemAvatar>
      <ListItemText>
        <Typography variant="body1">{doc.fileName}</Typography>
      </ListItemText>
    </ListItem>
  );
});
