import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const Image = styled('img')({
  width: '100%',
  height: '100%',
  borderRadius: '8px',
  zIndex: 1201,
  position: 'relative'
});

interface Props {
  onClick: () => void;
  className?: string;
  id?: string;
}

export const InstructionButton: React.FC<Props> = observer(({ onClick, className, id }) => (
  <Box id={id} onClick={onClick} sx={{ width: 180, height: 90, cursor: 'pointer' }} className={className}>
    <Image src={'/img/instruction.png'} />
  </Box>
));
