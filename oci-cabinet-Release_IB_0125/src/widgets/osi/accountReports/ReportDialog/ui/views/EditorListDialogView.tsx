import { Box, Button, DialogActions, DialogContent, Typography } from '@mui/material';
import moment from 'moment/moment';
import { observer } from 'mobx-react-lite';
import { useReportDialogContext } from '@widgets/osi/accountReports/ReportDialog/model/context';
import { ViewMode } from '@widgets/osi/accountReports/ReportDialog/model/type';
import {
  DataGridPro,
  GridColDef,
  GridRowClassNameParams,
  GridValueFormatterParams,
  useGridApiRef
} from '@mui/x-data-grid-pro';
import { AccountReportListItem, OperationTypes } from '@shared/types/osi/accountReports';
import { DetailsGrid } from '@widgets/osi/accountReports/ReportDialog/ui/dataGrid/DetailsGrid';
import { AllAccountReportsViewModel } from '@widgets/osi/accountReports/allAccountReports/model/viewModel';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import React from 'react';
import { ItemCategorySelect } from '@widgets/osi/accountReports/ReportDialog/ui/dataGrid/ItemCategorySelect';
import _ from 'lodash';
import { darken, lighten, styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from '@shared/utils/i18n';
import { EditorFilters } from '../dataGrid/EditorFilters';

const getBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getHoverBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

const EditorHeaderStyled = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  columnGap: '100px'
});

export const EditorListDialogView: React.FC = observer(() => {
  const apiRef = useGridApiRef();
  const viewModel = useReportDialogContext();
  const { getGridLocale: ggl, t } = useTranslation();

  // const [filterModel, setFilterModel] = useState({ items: [] } as GridFilterModel);

  if (!viewModel || !viewModel.reportDialog) return null;

  const { reportDialog, isGridError, isGridLoading } = viewModel;
  const {
    selectedAccount,
    editorFilters: { filterModel }
  } = reportDialog;
  const periodString = viewModel?.editingListPeriod;

  const columns: GridColDef[] = [
    {
      field: 'dt',
      headerName: `${t('accountReports:operation.date')}`,
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      maxWidth: 150,
      valueFormatter: (params) => {
        if (params.value === null) {
          return '';
        }

        return moment(params.value).format('DD.MM.YYYY');
      }
    },
    {
      field: 'amount',
      headerName: `${t('accountReports:amount')}`,
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      maxWidth: 250
    },
    {
      field: 'assign',
      headerName: `${t('accountReports:operationAssign')}`,
      align: 'center',
      headerAlign: 'center',
      flex: 1
    },
    {
      field: 'categoryId',
      headerName: `${t('accountReports:category')}`,
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      maxWidth: 250,
      renderCell: (params) => <ItemCategorySelect row={params.row} />
    },
    {
      field: 'operationType',
      headerName: `${t('accountReports:operation.type')}`,
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      maxWidth: 150,
      valueFormatter: (params: GridValueFormatterParams<OperationTypes>) => {
        if (params.value === 'DEBET') return `${t('accountReports:debet')}`;
        return `${t('accountReports:kredit')}`;
      }
    },
    {
      field: 'filled',
      headerName: ''
    }
  ];

  const rows = selectedAccount?.items ?? [];

  const getDetailPanel = ({ row }: { row: AccountReportListItem }) => (
    <DetailsGrid item={row} itemsGridApiRef={apiRef} />
  );

  const saveListHandler = () => {
    viewModel.saveList();
  };

  const closeHandler = () => {
    if (viewModel instanceof AllAccountReportsViewModel) {
      viewModel.closeEditor();
      return;
    }

    viewModel.changeViewMode(ViewMode.Select_account);
  };

  const getRowClassName = (params: GridRowClassNameParams) => {
    const { amount, details, operationType } = params.row;

    const rowClassName = operationType === 'DEBET' ? 'debet' : 'kredit';

    if (!details?.length) return rowClassName;

    const currentAmount = details?.reduce((acc: number, detail: { amount: number | string }) => {
      const { amount } = detail;

      if (_.isNumber(amount) === false) {
        return acc;
      }

      return acc + Number(amount);
    }, 0);

    if (currentAmount === amount) return rowClassName;

    return 'error-detail-amount-row';
  };

  return (
    <>
      <DialogContent>
        <Box
          sx={{
            '& .error-detail-amount-row': {
              bgcolor: (theme) => lighten(theme.palette.error.main, 0.6),
              '&:hover': {
                bgcolor: (theme) => lighten(theme.palette.error.main, 0.5)
              },
              '&.Mui-selected': {
                bgcolor: (theme) => lighten(theme.palette.error.main, 0.4)
              }
            },
            '& .debet': {
              bgcolor: '#ffc8ce',
              color: '#71151a',
              '&:hover': {
                bgcolor: `${lighten('#ffc8ce', 0.5)} !important`
              },
              '&.Mui-selected': {
                bgcolor: `${lighten('#ffc8ce', 0.4)} !important`
              }
            },
            '& .kredit': {
              bgcolor: '#c6efcd',
              color: '#104e1f',
              '&:hover': {
                bgcolor: `${lighten('#c6efcd', 0.5)} !important`
              },
              '&.Mui-selected': {
                bgcolor: `${lighten('#c6efcd', 0.4)} !important`
              }
            }
          }}
        >
          <EditorHeaderStyled>
            <Box>
              <Typography>{`${selectedAccount?.accountTypeNameRu}: ${selectedAccount?.account}`}</Typography>
              <Typography>{`${t('accountReports:list.period', { period: periodString })}`}</Typography>
              <Typography>{`${t('accountReports:list.begin', { begin: selectedAccount?.begin })}`}</Typography>
              <Typography>{`${t('accountReports:list.end', { begin: selectedAccount?.end })}`}</Typography>
            </Box>
            <Box>
              <EditorFilters viewModel={viewModel} />
            </Box>
          </EditorHeaderStyled>
          <DataGridPro
            sx={{
              '& .MuiDataGrid-detailPanel': {
                backgroundColor: (theme) => theme.palette.background.paper
              }
            }}
            apiRef={apiRef}
            hideFooter
            columns={columns}
            rows={rows}
            rowHeight={40}
            headerHeight={40}
            getDetailPanelHeight={() => 'auto'}
            getDetailPanelContent={getDetailPanel}
            components={{
              DetailPanelExpandIcon: ExpandIcon,
              DetailPanelCollapseIcon: CollapseIcon
            }}
            getRowClassName={getRowClassName}
            filterModel={filterModel}
            columnVisibilityModel={{
              filled: false
            }}
            localeText={ggl()}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          loading={isGridLoading}
          variant={'outlined'}
          onClick={saveListHandler}
          disabled={viewModel?.reportDialog.isReadonly || isGridError}
        >
          {t('common:save')}
        </LoadingButton>
        <Button variant={'outlined'} onClick={closeHandler}>
          {t('common:close')}
        </Button>
      </DialogActions>
    </>
  );
});

const ExpandIcon: React.FC = () => <AddCircleOutlineIcon sx={(theme) => ({ color: theme.palette.primary.main })} />;

const CollapseIcon: React.FC = () => (
  <RemoveCircleOutlineIcon sx={(theme) => ({ color: theme.palette.primary.main })} />
);
