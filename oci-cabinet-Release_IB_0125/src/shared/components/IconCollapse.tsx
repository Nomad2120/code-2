import { Box, CardActionArea, Tooltip } from '@mui/material';

interface Props {
  onToggleCollapse: () => void;
  collapseClick: any;
}

export const IconCollapse = ({ onToggleCollapse, collapseClick }: Props) => (
  <Tooltip title="Mini Menu">
    <CardActionArea
      onClick={onToggleCollapse}
      sx={{
        width: 18,
        height: 18,
        display: 'flex',
        cursor: 'pointer',
        borderRadius: '50%',
        alignItems: 'center',
        color: 'text.primary',
        justifyContent: 'center',
        border: 'solid 1px currentColor',
        ...(collapseClick && {
          borderWidth: 2
        })
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: 'currentColor',
          transition: (theme) => theme.transitions.create('all'),
          ...(collapseClick && {
            width: 0,
            height: 0
          })
        }}
      />
    </CardActionArea>
  </Tooltip>
);
