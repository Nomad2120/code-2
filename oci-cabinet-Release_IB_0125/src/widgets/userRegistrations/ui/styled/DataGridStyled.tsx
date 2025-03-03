import { darken, lighten, styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

export const DataGridStyled = styled(DataGrid)(({ theme }) => {
  const getBackgroundColor = (color: any) => (theme.palette.mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6));

  const getHoverBackgroundColor = (color: any) =>
    theme.palette.mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);
  return {
    '& .data-grid--CREATED': {
      backgroundColor: getBackgroundColor(theme.palette.info.main),
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(theme.palette.info.main)
      }
    },
    '& .data-grid--CONFIRMED': {
      backgroundColor: getBackgroundColor(theme.palette.success.main),
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(theme.palette.success.main)
      }
    },
    '& .data-grid--CLOSED': {
      backgroundColor: getBackgroundColor(theme.palette.error.main),
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(theme.palette.error.main)
      }
    }
  };
});
