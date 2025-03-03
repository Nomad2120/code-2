import {
  IOsiServiceAbonentsButtonFeatureViewModelToken,
  IOsiServiceAbonentsButtonFeatureViewModel
} from '@shared/types/mobx/features/osiAccruals';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import PeopleIcon from '@mui/icons-material/People';
import { LoadingButton } from '@mui/lab';
import React, { MutableRefObject, useEffect, useImperativeHandle } from 'react';
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Slide,
  Typography
} from '@mui/material';
import { useTranslation } from '@shared/utils/i18n';
import {
  DataGridPro,
  GridCellParams,
  GridColDef,
  GridPreProcessEditCellProps,
  GridValueSetterParams,
  MuiEvent,
  useGridApiRef
} from '@mui/x-data-grid-pro';
import flatComparator from '@shared/utils/helpers/flatComparator';
import { OsiServiceResponse } from '@shared/types/osi/services';
import { QuickSelectors } from '@features/osi/accruals/quickSelectors';
import { delay } from '@shared/utils';
import logger from 'js-logger';
import { ParkingField } from './ParkingField';

interface Props {
  service?: OsiServiceResponse | null;
  reloadCb: () => Promise<void>;
  ref?: MutableRefObject<RefHandle | null>;
  isButtonHidden?: boolean;
}

export interface RefHandle {
  openTableManual: (service: OsiServiceResponse) => void;
}

// @ts-expect-error component not typed
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const ComponentWithForwardRef = React.forwardRef<RefHandle, Props>(
  ({ service = null, reloadCb, isButtonHidden = false }, ref) => {
    const vm = useInjection<IOsiServiceAbonentsButtonFeatureViewModel>(IOsiServiceAbonentsButtonFeatureViewModelToken);

    const { t, fieldWithPrefix: fwp, addPrefix, getGridLocale } = useTranslation();

    const apiRef = useGridApiRef();

    useImperativeHandle(ref, () => ({
      openTableManual: async (service: OsiServiceResponse) => {
        vm.service = service;
        await vm.openAbonentsTable();
      }
    }));

    useEffect(() => {
      vm.service = service;
    }, [service, vm]);

    useEffect(() => {
      vm.reloadCb = reloadCb;
    }, [reloadCb, vm]);

    vm.apiRef = apiRef;

    const cols: GridColDef[] = [
      {
        field: 'flat',
        headerName: t('common:flat'),
        flex: 1,
        sortComparator: flatComparator
      },
      {
        field: addPrefix('areaTypeName'),
        headerName: t('common:type'),
        flex: 1
      },
      {
        field: 'name',
        headerName: t('common:owner'),
        flex: 3
      },
      {
        field: 'floor',
        headerName: t('common:floor'),
        flex: 1
      },
      {
        field: 'square',
        headerName: t('common:square'),
        flex: 1
      }
    ];

    const parkingCols: GridColDef[] = [
      {
        field: 'parkingPlaces',
        headerName: t('common:parkingPlaces'),
        flex: 1,
        editable: true,
        type: 'number',
        align: 'left',
        preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
          const hasError = params.props.value < 1;
          return { ...params.props, error: hasError };
        },
        valueSetter: (params: GridValueSetterParams) => {
          logger.info('edit setter', params);
          vm.changeParkingPlaces(params.row.id, params.value);
          return { ...params.row, parkingPlaces: params.value };
        },
        renderEditCell: (params) => <ParkingField viewModel={vm} {...params} />
      }
    ];

    const cellClickHandler = async (params: GridCellParams, event: MuiEvent<React.MouseEvent>) => {
      if (!vm.isParkingService) return;

      event.defaultMuiPrevented = true;
      await delay(1);
      if (params.field === '__check__') {
        // @ts-expect-error checked is exist in target
        if (!event.target.checked) return;

        await apiRef.current.startCellEditMode({ id: params.id, field: 'parkingPlaces' });
      }
    };

    return (
      <>
        {!isButtonHidden && (
          <LoadingButton
            variant="outlined"
            startIcon={<PeopleIcon />}
            color={!vm.activeAbonentsCount ? 'secondary' : 'primary'}
            onClick={vm.openAbonentsTable}
            loading={vm.isAbonentsTableLoading}
            disabled={!vm.service?.isActive || vm.service?.isOsiBilling}
          >
            {vm.isAdditionalService ? `${vm.activeAbonentsCount}` : `${vm.activeAbonentsCount} / ${vm.abonentsCount}`}
          </LoadingButton>
        )}
        <Dialog
          open={vm.isDialogOpen}
          maxWidth="xl"
          onClose={vm.cancelEditing}
          // @ts-expect-error component not typed
          TransitionComponent={Transition}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title" sx={{ width: '50vw' }}>
            <Typography noWrap>{`${t('accruals:service')}: ${fwp(
              vm.service ?? {
                nameRu: '',
                nameKz: ''
              },
              'name'
            )}`}</Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <Card sx={{ width: '80vw', px: 1, borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}>
              <DataGridPro
                apiRef={apiRef}
                columns={vm.isParkingService ? [...parkingCols, ...cols] : cols}
                rows={vm.abonents?.slice().sort((a, b) => flatComparator(a?.flat, b?.flat))}
                checkboxSelection
                selectionModel={vm.selectedAbonentsIds}
                onSelectionModelChange={(newModel) => {
                  vm.apiRef = apiRef;
                  vm.selectedAbonentsIds = newModel;
                }}
                disableSelectionOnClick
                density="compact"
                sx={{
                  '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
                    outline: 'none'
                  }
                }}
                components={{
                  LoadingOverlay: LinearProgress,
                  Toolbar: QuickSelectors
                }}
                componentsProps={{
                  toolbar: { viewModel: vm }
                }}
                loading={vm.isLoading}
                isRowSelectable={() => !vm.isLoading}
                editMode="cell"
                experimentalFeatures={{ newEditingApi: true }}
                localeText={getGridLocale()}
                rowHeight={35}
                isCellEditable={(params) => vm.selectedAbonentsIds.includes(params.id)}
                onCellClick={cellClickHandler}
              />
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={vm.cancelEditing}>
              <Typography>{t('common:cancel')}</Typography>
            </Button>
            <Button disabled={vm.isLoading} onClick={vm.save}>
              <Typography>{t('common:save')}</Typography>
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

export const OsiServiceAbonentsButton: React.FC<Props> = observer(ComponentWithForwardRef);
