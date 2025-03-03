import {
  DataGridPro,
  GridColDef,
  GridEditInputCell,
  GridPreProcessEditCellProps,
  GridRenderEditCellParams,
  GridRowClassNameParams,
  useGridApiRef
} from '@mui/x-data-grid-pro';
import { observer } from 'mobx-react-lite';
import { AccountReportListItem, AccountReportListItemDetail } from '@shared/types/osi/accountReports';
import { ChangeEvent, useState } from 'react';
import { Box, Button, IconButton, styled, Tooltip } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from '@mui/icons-material/Delete';
import _ from 'lodash';
import clsx from 'clsx';
import { DetailCategorySelect } from '@widgets/osi/accountReports/ReportDialog/ui/dataGrid/DetailCategorySelect';
import logger from 'js-logger';
import { darken, lighten } from '@mui/material/styles';
import { useTranslation } from '@shared/utils/i18n';
import { useReportDialogContext } from '../../model/context';

const DetailsGridWrapperStyled = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  marginTop: '-18px',
  marginLeft: '50px',
  padding: '5px 0px',
  height: '200px'
}));

interface Props {
  item: AccountReportListItem;
  itemsGridApiRef: any;
}

const getBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getHoverBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

export const DetailsGrid: React.FC<Props> = observer(({ item, itemsGridApiRef }) => {
  const apiRef = useGridApiRef();
  const viewModel = useReportDialogContext();
  const { getGridLocale: ggl, t } = useTranslation();

  const [rows, setRows] = useState(item?.details ?? []);

  const addHandler = () => {
    const id = uuidv4();

    viewModel?.updateItemCategory(item.id, '');

    const rowsMap = apiRef.current.getRowModels();
    const oldRows = Array.from(rowsMap, ([key, value]) => ({ ...value }));

    const emptyRow = { id, amount: '', comment: '', categoryId: '', isNew: true };

    apiRef.current.setRows([...oldRows, { ...emptyRow }]);

    itemsGridApiRef.current.forceUpdate();

    setTimeout(() => {
      apiRef.current.startCellEditMode({ id, field: 'amount' });
    });
  };

  const preProcessEditCellProps = (params: GridPreProcessEditCellProps) => {
    const enteredValue = params.props.value;

    const editingAmount = Number(enteredValue);

    if (!_.isFinite(editingAmount) || editingAmount < 0) {
      return {
        ...params.props,
        error: t('accountReports:validations.notFiniteNumber')
      };
    }

    const totalAmount = item.amount;

    const otherDetails = item.details?.filter((detail) => detail.id !== params.row.id);

    const currentAmount = otherDetails?.reduce((acc, detail) => {
      const { amount } = detail;

      if (_.isNumber(amount) === false) {
        return acc;
      }

      return acc + Number(amount);
    }, 0);

    let newAmount = currentAmount ?? 0;

    const maxAllowAmountForCell = totalAmount - newAmount;

    if (_.isFinite(editingAmount)) {
      newAmount += editingAmount;
    }

    const hasError = newAmount > totalAmount;

    return {
      ...params.props,
      error: hasError ? t('accountReports:validations.maxAllowedError', { maxAllowAmountForCell }) : false
    };
  };

  const renderAmountEditCell = (params: GridRenderEditCellParams) => <AmountEditInputCell {...params} />;

  const columns: GridColDef[] = [
    { field: 'id' },
    {
      field: 'actions',
      type: 'actions',
      width: 120,
      renderHeader: () => (
        <Button disabled={viewModel?.reportDialog.isReadonly} variant={'outlined'} size={'small'} onClick={addHandler}>
          {t('common:add')}
        </Button>
      ),
      renderCell: (params) => (
        <IconButton
          disabled={viewModel?.reportDialog.isReadonly}
          onClick={() => {
            viewModel?.deleteDetail(params.id);
            apiRef.current.updateRows([{ id: params.id, _action: 'delete' }]);

            const rowsMap = apiRef.current.getRowModels();
            const oldRows = Array.from(rowsMap, ([key, value]) => ({ ...value }));

            apiRef.current.setRows(oldRows?.filter((row) => row.id !== params.id));

            itemsGridApiRef.current.selectRow(item.id, false);
          }}
          aria-label={'delete'}
          size={'small'}
          color={'primary'}
        >
          <DeleteIcon />
        </IconButton>
      )
    },
    {
      field: 'amount',
      headerName: `${t('accountReports:amount')}`,
      editable: !viewModel?.reportDialog.isReadonly,
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      maxWidth: 200,
      cellClassName: 'amount-cell',
      preProcessEditCellProps,
      renderEditCell: renderAmountEditCell
    },
    {
      field: 'categoryId',
      headerName: `${t('accountReports:category')}`,
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      maxWidth: 250,
      renderCell: (params) => <DetailCategorySelect {...params} detail={params.row} item={item} />
    },
    {
      field: 'comment',
      headerName: `${t('accountReports:operationAssign')}`,
      editable: !viewModel?.reportDialog.isReadonly,
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      cellClassName: 'comment-cell'
    }
  ];

  const getRowClassName = (params: GridRowClassNameParams) => {
    const { categoryId, amount } = params.row;

    if (!categoryId || !amount) return 'error-row';

    return '';
  };

  const processRowUpdate = (params: AccountReportListItemDetail) => {
    viewModel?.updateItemDetails(item, params);
    return params;
  };

  return (
    <DetailsGridWrapperStyled
      sx={{
        '& .error-row': {
          bgcolor: (theme) => getBackgroundColor(theme.palette.error.main, theme.palette.mode),
          '&:hover': {
            bgcolor: (theme) => getHoverBackgroundColor(theme.palette.error.main, theme.palette.mode)
          }
        }
      }}
    >
      <DataGridPro
        apiRef={apiRef}
        sx={{
          height: '100%',
          backgroundColor: (theme) => theme.palette.background.paper,
          '& .MuiDataGrid-overlay': {
            backgroundColor: (theme) => theme.palette.background.paper
          }
        }}
        className={'details-grid'}
        hideFooter
        autoHeight
        columns={columns}
        rows={rows}
        rowHeight={40}
        headerHeight={40}
        editMode={'cell'}
        columnVisibilityModel={{
          id: false
        }}
        getRowClassName={getRowClassName}
        experimentalFeatures={{ newEditingApi: true, preventCommitWhileValidating: true }}
        processRowUpdate={processRowUpdate}
        localeText={ggl()}
      />
    </DetailsGridWrapperStyled>
  );
});

const AmountEditInputCell: React.FC<GridRenderEditCellParams> = (props) => {
  const { error } = props;

  return (
    <Tooltip open={!!error} title={error}>
      <GridEditInputCell
        {...props}
        onKeyDown={(e: KeyboardEvent) => {
          console.log('process key', e);
          if (e.key === 'Enter') {
            props.api.stopCellEditMode({ id: props.id, field: 'amount' });
          }
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          console.log('process amount', e.target.value);
          props.api.setEditCellValue({ id: props.id, field: 'amount', value: e.target.value });
        }}
        className={clsx([!!error && 'error'])}
      />
    </Tooltip>
  );
};
