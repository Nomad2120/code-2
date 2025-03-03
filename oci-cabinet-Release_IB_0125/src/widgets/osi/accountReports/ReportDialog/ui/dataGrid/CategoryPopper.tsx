import { observer } from 'mobx-react-lite';
import { Fade, Paper, Popper } from '@mui/material';

interface CategoryPopperProps {
  isShowPopper: boolean;
  anchorEl: HTMLDivElement | null;
  content: string;
  setIsShowPopper: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CategoryPopper: React.FC<CategoryPopperProps> = observer(
  ({ isShowPopper, setIsShowPopper, anchorEl, content }) => (
    <Popper
      id={'popper'}
      open={isShowPopper && anchorEl !== null}
      anchorEl={anchorEl}
      style={{ maxWidth: '900px', zIndex: 1300 }}
      transition
      onMouseEnter={() => setIsShowPopper(false)}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350} style={{ transitionDelay: '1000ms' }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <p>{content}</p>
          </Paper>
        </Fade>
      )}
    </Popper>
  )
);
