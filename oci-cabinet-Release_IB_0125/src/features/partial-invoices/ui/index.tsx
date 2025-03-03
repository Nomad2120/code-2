import { Button } from '@mui/material';
import { tokens, TranslatedToken } from '../../../shared/utils/i18n';

interface Props {
  sx: any;
  onClick: () => void;
  disabled?: boolean;
}

export const PartialInvoicesButton = ({ sx, onClick, disabled = false }: Props): JSX.Element => (
  <Button type="button" variant="outlined" onClick={onClick} sx={sx} disabled={disabled}>
    <TranslatedToken id={tokens.osiInvoices.createPartialInvoices} />
  </Button>
);
