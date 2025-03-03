import { observer } from 'mobx-react-lite';
import { Box, Card, Toolbar, Typography } from '@mui/material';
import { useTranslation } from '@shared/utils/i18n';
import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  IUserRegistrationsViewModel,
  token as IUserRegistrationsViewModelToken
} from '@shared/types/mobx/widgets/UserRegistrations';
import { useInjection } from 'inversify-react';
import { GridRowParams, GridSortModel } from '@mui/x-data-grid';
import { OSICoreModelsDbRegistration } from '@shared/api/orval/models';
import { Trans } from 'react-i18next';
import { DataGridStyled } from './styled/DataGridStyled';

// TODO:translate
export const UserRegistrations: React.FC = observer(() => {
  const viewModel = useInjection<IUserRegistrationsViewModel>(IUserRegistrationsViewModelToken);
  const { t } = useTranslation();
  const theme = useTheme();

  const columns = useMemo(
    () => [
      {
        field: 'createDt',
        headerName: t('registration:userRegistrations.headers.created'),
        width: 200,
        type: 'dateTime',
        valueGetter: (params: any) => new Date(params.value).toLocaleString('ru-RU')
      },
      {
        field: 'stateName',
        headerName: t('registration:userRegistrations.headers.state'),
        width: 150
      },
      { field: 'name', headerName: t('registration:userRegistrations.headers.name'), width: 300 },
      { field: 'idn', headerName: t('registration:userRegistrations.headers.IDN'), width: 150 },
      { field: 'address', headerName: t('registration:userRegistrations.headers.address'), width: 400 }
    ],
    [t]
  );

  const selectRegistration = (params: GridRowParams<OSICoreModelsDbRegistration>) => {
    viewModel.selectRegistration(params.row);
  };

  const changeSortModel = (sortModel: GridSortModel) => {
    viewModel.sortModel = sortModel;
  };

  return (
    <Card>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: theme.spacing(0, 1, 0, 3)
        }}
      >
        <Typography variant="h6" id="tableTitle" component="p">
          <Trans i18nKey={'registration:userRegistrations.title'} />
        </Typography>
      </Toolbar>

      <Box sx={{ height: 480 }}>
        <DataGridStyled
          pagination
          density="compact"
          pageSize={10}
          rowsPerPageOptions={[10]}
          sortModel={viewModel.sortModel}
          onSortModelChange={changeSortModel}
          rows={viewModel.registrations}
          columns={columns}
          getRowClassName={(params) => `data-grid--${params.row.stateCode}`}
          onRowClick={selectRegistration}
        />
      </Box>
    </Card>
  );
});
