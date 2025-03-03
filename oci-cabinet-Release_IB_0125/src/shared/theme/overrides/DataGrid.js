// ----------------------------------------------------------------------

export default function DataGrid(theme) {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          marginTop: theme.spacing(2),
          minHeight: theme.spacing(50),
          '& .MuiTablePagination-root': {
            borderTop: 0
          },
          '& .MuiDataGrid-iconSeparator': {
            display: 'none'
          },
          '& .MuiDataGrid-toolbarContainer': {
            '& .MuiButton-root': {
              marginRight: theme.spacing(1.5),
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }
          },
          '& .MuiDataGrid-columnHeader:not(:last-of-type), .MuiDataGrid-cell': {
            borderRight: `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'}`
          },
          '& .MuiDataGrid-cell, .MuiDataGrid-columnsContainer': {
            borderBottom: `1px solid ${theme.palette.divider}`,
            borderRight: `1px solid ${theme.palette.divider}`
          },
          '& .MuiDataGrid-columnSeparator': {
            color: theme.palette.divider
          },
          '& .MuiDataGrid-editInputCell input': {
            padding: theme.spacing(0, 2),
            height: '100%',
            textAlign: 'end'
          },
          '& .MuiDataGrid-columnHeader[data-field="__check__"]': {
            padding: 0
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            whiteSpace: 'pre-wrap',
            lineHeight: 1
          }
        }
      }
    },
    MuiGridMenu: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-gridMenuList': {
            boxShadow: theme.customShadows.z20,
            borderRadius: theme.shape.borderRadius
          },
          '& .MuiMenuItem-root': {
            ...theme.typography.body2
          }
        }
      }
    },
    MuiGridFilterForm: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1.5, 0),
          '& .MuiFormControl-root': {
            margin: theme.spacing(0, 0.5)
          },
          '& .MuiInput-root': {
            marginTop: theme.spacing(3),
            '&::before, &::after': {
              display: 'none'
            },
            '& .MuiNativeSelect-select, .MuiInput-input': {
              ...theme.typography.body2,
              padding: theme.spacing(0.75, 1),
              borderRadius: theme.shape.borderRadius,
              backgroundColor: theme.palette.background.neutral
            },
            '& .MuiSvgIcon-root': {
              right: 4
            }
          }
        }
      }
    },
    MuiGridPanelFooter: {
      styleOverrides: {
        root: {
          padding: theme.spacing(2),
          justifyContent: 'flex-end',
          '& .MuiButton-root': {
            '&:first-of-type': {
              marginRight: theme.spacing(1.5),
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            },
            '&:last-of-type': {
              color: theme.palette.common.white,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              }
            }
          }
        }
      }
    }
  };
}
