import { observer } from 'mobx-react-lite';
import { Button, Tooltip } from '@mui/material';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { tokens, TranslatedToken } from '@shared/utils/i18n';

interface Props {
  title?: string;
  disabled?: boolean;
  onClick: () => void;
}

export const TooltipButton: React.FC<Props> = observer(({ title, disabled, onClick }) => (
  <Tooltip title={disabled ? title : ''}>
    <span>
      <Button
        sx={{
          ml: 2,
          '&.Mui-disabled': {
            pointerEvents: 'all'
          }
        }}
        variant="outlined"
        color="primary"
        startIcon={<LibraryAddIcon />}
        disabled={disabled}
        onClick={onClick}
      >
        <TranslatedToken id={tokens.common.add} />
      </Button>
    </span>
  </Tooltip>
));
