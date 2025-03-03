import React, { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import {
  Box,
  Button,
  Grid,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography
} from '@mui/material';
import { formatPhone } from '@shared/utils/helpers/formatString';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import {
  DataGridPro,
  GridCellModes,
  GridCellParams,
  GridColDef,
  GridEditInputCell,
  GridEditModes,
  GridRenderEditCellParams,
  GridRowEditStopParams,
  GridRowModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridValueFormatterParams,
  GridValueGetterParams,
  useGridApiContext,
  useGridApiRef
} from '@mui/x-data-grid-pro';
import { observer } from 'mobx-react-lite';
import {
  IOsiAbonentsWidgetViewModel,
  IOsiAbonentsWidgetViewModelToken
} from '@shared/types/mobx/widgets/OsiAbonentsWidget';
import { useInjection } from 'inversify-react';
import { Abonent } from '@shared/types/osi/abonents';
import _ from 'lodash';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import { createAbonent, getAbonent, updateAbonent } from '@shared/api/abonents';
import { formatAbonentRow } from '@widgets/osi/abonents/utils';
import logger from 'js-logger';
import { AreaTypeCodes } from '@shared/types/dictionaries';
import clsx from 'clsx';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';
import * as Yup from 'yup';
import { checkBIN, checkIIN } from '@shared/utils/helpers/validation/validateIDN';
import IMask from 'imask';
import { styled } from '@mui/material/styles';
import { ImportAbonentsButton } from '@widgets/osi/abonents/ui/ImportAbonentsButton';
import { OsiAddAbonentButton } from './OsiAddAbonentButton';

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText
  }
}));

const RequiredEditCell = (props: GridRenderEditCellParams) => {
  const { t } = useTranslation();
  const { error, hasFocus, value, cellMode } = props;

  const isError = !!error || (hasFocus && cellMode === GridCellModes.Edit && !value);

  return (
    <StyledTooltip open={isError} title={t('abonents:validation.requiredField')}>
      <GridEditInputCell {...props} />
    </StyledTooltip>
  );
};

function renderRequiredEditCell(params: GridRenderEditCellParams) {
  return <RequiredEditCell {...params} />;
}

const checkRequiredCell = (params: GridCellParams, apiRef: MutableRefObject<GridApiPro>) => {
  const { cellMode, id, field } = params;

  if (cellMode !== GridCellModes.Edit) return '';

  const currentValue = apiRef.current.unstable_getRowWithUpdatedValuesFromCellEditing(id, field)[field];

  if (!currentValue) return clsx('required', 'Mui-error');

  return '';
};

const validatePhone = Yup.string()
  .min(16, tokens.common.formFields.phone.validation.tooShort)
  .max(16, tokens.common.formFields.phone.validation.error);

const validateIIN = Yup.string()
  .test(
    'idn-test',
    () => tokens.common.formFields.IDNOSI.validation.error,
    (value) => checkIIN(value as string) || checkBIN(value as string) || !value
  )
  .notRequired();

interface Props {
  onChangeAbonents?: (abonents: Abonent[]) => void;
}

export const OsiAbonentsWidget: React.FC<Props> = observer(({ onChangeAbonents }) => {
  const vm = useInjection<IOsiAbonentsWidgetViewModel>(IOsiAbonentsWidgetViewModelToken);
  const { t, getGridLocale: ggl } = useTranslation();

  useEffect(() => {
    if (!onChangeAbonents) return;

    onChangeAbonents(vm.abonents);
  }, [vm.abonents]);

  const { translateToken: tt, getGridLocale } = useTranslation();

  const apiRef = useGridApiRef();

  const columns: GridColDef[] = [
    {
      field: 'flat',
      headerName: t('abonents:grid.number'),
      valueGetter: (params: GridValueGetterParams) => {
        if (params.row.external) {
          return t('abonents:externalAbonent', { name: params.row.name });
        }
        return params.row?.flat;
      },
      flex: 2,
      type: 'string',
      editable: true,
      cellClassName: (params: GridCellParams<string>) => checkRequiredCell(params, apiRef),
      renderEditCell: renderRequiredEditCell,
      preProcessEditCellProps: async (params: any) => {
        if (!params.hasChanged) return { ...params.props };
        const isValid = !!params.props.value;

        return { ...params.props, error: !isValid };
      }
    },
    {
      field: 'id',
      headerName: t('abonents:grid.personalAcc'),
      width: 80,
      editable: false,
      valueFormatter: ({ value }: GridValueFormatterParams<any>) => {
        if (typeof value === 'string') {
          return '';
        }
        return value;
      }
    },
    {
      field: 'ercAccount',
      headerName: t('abonents:grid.ercAccount'),
      width: 80,
      editable: false
    },
    {
      field: 'square',
      headerName: t('abonents:grid.square'),
      width: 90,
      type: 'number',
      editable: true,
      cellClassName: (params: GridCellParams<number>) => checkRequiredCell(params, apiRef),
      renderEditCell: renderRequiredEditCell,
      preProcessEditCellProps: async (params: any) => {
        if (!params.hasChanged) return { ...params.props };
        const isValid = !!params.props.value && params.props.value > 0;

        return { ...params.props, error: !isValid };
      }
    },
    {
      field: 'effectiveSquare',
      headerName: t('abonents:grid.effectiveSquare'),
      headerAlign: 'center',
      width: 100,
      type: 'number',
      editable: true
    },
    {
      field: 'floor',
      headerName: t('abonents:grid.floor'),
      headerAlign: 'center',
      width: 80,
      type: 'number',
      editable: true
    },
    {
      field: 'name',
      headerName: t('abonents:grid.name'),
      flex: 3,
      editable: true
    },
    {
      field: 'owner',
      headerName: t('abonents:grid.owner'),
      flex: 3,
      editable: true
    },
    {
      field: 'idn',
      headerName: t('abonents:grid.idn'),
      width: 120,
      editable: true,
      preProcessEditCellProps: async (params: any) => {
        if (!params.hasChanged) return { ...params.props };
        const isValid = await validateIIN.isValid(params.props.value);

        return { ...params.props, error: !isValid };
      },
      valueParser: (value, params) => {
        const mask = IMask.createMask({
          mask: '############',
          definitions: {
            '#': /[0-9]/
          }
        });
        mask.resolve(value);
        return mask.value;
      }
    },
    {
      field: 'phone',
      headerName: t('abonents:grid.phone'),
      headerAlign: 'center',
      width: 140,
      valueFormatter: (params: any) => formatPhone(params.value),
      valueParser: (value, params) => {
        const mask = IMask.createMask({
          mask: '+7 7## ### ## ##',
          definitions: {
            '#': /[0-9]/
          }
        });
        mask.resolve(value);
        return mask.value;
      },
      preProcessEditCellProps: async (params: any) => {
        if (!params.hasChanged) return { ...params.props };
        const isValid = await validatePhone.isValid(params.props.value);

        return { ...params.props, error: !isValid };
      },
      // cellClassName: (params: GridCellParams<string>) => checkRequiredCell(params, apiRef),
      editable: true
    },
    {
      field: 'areaTypeCode',
      headerName: t('abonents:grid.areaType'),
      width: 100,
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => <AreaTypeSelect params={params} />,
      valueFormatter: ({ value }: GridValueFormatterParams<AreaTypeCodes>) => {
        if (value === AreaTypeCodes.NON_RESIDENTIAL) return t('abonents:areaTypes.nonResidental');
        if (value === AreaTypeCodes.RESIDENTIAL) return t('abonents:areaTypes.residental');
        if (value === AreaTypeCodes.BASEMENT) return t('abonents:areaTypes.basement');

        return value;
      },
      cellClassName: (params: GridCellParams<AreaTypeCodes>) => checkRequiredCell(params, apiRef)
    },
    {
      field: 'livingFact',
      headerName: t('abonents:grid.livingFact'),
      width: 80,
      type: 'number',
      editable: true
    },
    {
      field: 'livingJur',
      headerName: t('abonents:grid.livingJur'),
      width: 80,
      type: 'number',
      editable: true
    }
  ];

  const checkAbonent = (abonent: Omit<Abonent, 'owner'> & { osiId: number | null; owner: string }) => {
    if (!abonent.id) throw new Error(t('abonents:validation.abonentId'));

    if (!abonent.areaTypeCode) throw new Error(t('abonents:validation.area'));

    if (!abonent.flat) throw new Error(t('abonents:validation.flat'));

    if (!abonent.square) throw new Error(t('abonents:validation.square'));

    return true;
  };

  const processAddNewAbonent = async (row: GridRowModel<Abonent>, vm: IOsiAbonentsWidgetViewModel) => {
    try {
      const abonent = formatAbonentRow(row, vm.osiId);

      checkAbonent(abonent);

      delete abonent.id;

      const newAbonent = await createAbonent(abonent);

      vm.cancelCreating();
      vm.clearTemporaryRow();
      vm.abonents.push(newAbonent);

      return newAbonent;
    } catch (e) {
      logger.error(e);
      notistackExternal.error(e);
      vm.cancelCreating();
      return null;
    }
  };

  const processRowUpdateHandler = async (
    newRow: GridRowModel<
      Abonent & {
        isNew?: boolean;
      }
    >,
    prevRow: GridRowModel<Abonent>
  ) => {
    if (_.isEqual(newRow, prevRow)) return prevRow;
    try {
      if (!vm.osiId) throw new Error(t('abonents:validation.osiId'));

      if (newRow?.isNew) {
        await processAddNewAbonent(newRow, vm);
        return prevRow;
      }

      const abonent = formatAbonentRow(newRow, vm.osiId);

      if (!abonent.id) {
        throw new Error(t('abonents:validation.abonentId'));
      }

      await updateAbonent(abonent.id, abonent);
      const updated = await getAbonent(abonent.id);
      vm.updateAbonent(updated);
      notistackExternal.success();
      return updated;
    } catch (e) {
      notistackExternal.error(e);
      return prevRow;
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 1 }} display="flex" alignItems="center">
        <Typography variant="h5">
          {tt(tokens.common.total)} : {vm.totalAbonents}
        </Typography>
        <OsiAddAbonentButton vm={vm} apiRef={apiRef} />
        <Button
          variant="outlined"
          color="primary"
          startIcon={<CloudDownloadIcon />}
          onClick={vm.downloadReport}
          sx={{ ml: 2 }}
        >
          <TranslatedToken id={tokens.common.download} />
        </Button>
        <ImportAbonentsButton vm={vm} />
      </Box>
      <Box sx={{ height: '65vh' }}>
        <DataGridPro
          rowHeight={28}
          sx={{
            '& .MuiDataGrid-cell--editing.required': {
              position: 'relative',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: '1px solid red'
              }
            },
            '& .Mui-error': {
              color: 'red'
            }
          }}
          apiRef={apiRef}
          initialState={{
            columns: {
              columnVisibilityModel: {
                ercAccount: false,
                owner: false,
                livingFact: false,
                livingJur: false
              }
            }
          }}
          loading={vm.isLoading}
          localeText={getGridLocale()}
          rows={vm.sortedAbonents}
          columns={columns as any}
          density="compact"
          disableSelectionOnClick
          onCellClick={(params) => {
            if (params.field === 'actions') {
              vm.startEditingAbonent(params.row);
            }
          }}
          processRowUpdate={processRowUpdateHandler}
          experimentalFeatures={{ newEditingApi: true }}
          onRowEditStop={(params: GridRowEditStopParams) => {
            const savedRow = apiRef.current.unstable_getRowWithUpdatedValuesFromRowEditing(params.id);
            setTimeout(() => {
              vm.saveTemporaryRow(savedRow);
              vm.cancelCreating();
            });
          }}
          editMode={GridEditModes.Row}
          components={{
            Toolbar,
            Footer: StateFooter,
            LoadingOverlay: LinearProgress
          }}
          componentsProps={{
            footer: { vm },
            toolbar: { vm, apiRef }
          }}
        />
      </Box>
    </Box>
  );
});

interface FooterProps {
  vm: IOsiAbonentsWidgetViewModel;
}

const StateFooter: React.FC<FooterProps> = observer(({ vm }) => (
  <Grid container spacing={2} direction="row">
    <Grid item xs={12} md={6}>
      <Stack sx={{ p: 1 }} direction="row">
        <TranslatedToken id={tokens.osiAbonents.totalSquare} /> -&nbsp;
        <Typography component="span" sx={{ pr: 2, color: 'primary.main' }}>
          {vm.totalSquare}
        </Typography>
        <Typography component="span" sx={{ color: 'primary.main' }}>
          {vm.totalParkingPlaces}
        </Typography>
      </Stack>
    </Grid>
    <Grid item xs={12} md={6}>
      <Stack sx={{ p: 1 }} direction="row" justifyContent="flex-end">
        <Typography>
          <TranslatedToken id={tokens.osiAbonents.totalRows} /> : {vm.totalAbonents}
        </Typography>
      </Stack>
    </Grid>
  </Grid>
));

interface ToolbarProps {
  vm: IOsiAbonentsWidgetViewModel;
}

const Toolbar: React.FC<ToolbarProps> = observer(({ vm }) => (
  <GridToolbarContainer>
    {/* @ts-expect-error-next-line */}
    <GridToolbarColumnsButton />
    {/* @ts-expect-error-next-line */}
    <GridToolbarFilterButton />
  </GridToolbarContainer>
));

interface SelectProps {
  params: GridRenderEditCellParams;
}

export const AreaTypeSelect: React.FC<SelectProps> = observer(({ params }) => {
  const { id, value, field, cellMode, hasFocus, error } = params;
  const apiRef = useGridApiContext();
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const isError = !!error || (hasFocus && cellMode === GridCellModes.Edit && !value);

  useLayoutEffect(() => {
    if (hasFocus) {
      inputRef.current?.focus();
    }
  }, [hasFocus]);

  const onChangeHandler = (e: any) => {
    const newValue = e.target.value;
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <StyledTooltip open={!isOpenMenu && isError} title={t('abonents:validation.requiredField')}>
      <TextField
        SelectProps={{
          onOpen: () => setIsOpenMenu(true),
          onClose: () => setIsOpenMenu(false)
        }}
        inputRef={inputRef}
        value={value}
        fullWidth
        select
        onChange={onChangeHandler}
      >
        <MenuItem dense value={AreaTypeCodes.RESIDENTIAL}>
          {t('abonents:areaTypes.residental')}
        </MenuItem>
        <MenuItem dense value={AreaTypeCodes.NON_RESIDENTIAL}>
          {t('abonents:areaTypes.nonResidental')}
        </MenuItem>
        <MenuItem dense value={AreaTypeCodes.BASEMENT}>
          {t('abonents:areaTypes.basement')}
        </MenuItem>
      </TextField>
    </StyledTooltip>
  );
});
