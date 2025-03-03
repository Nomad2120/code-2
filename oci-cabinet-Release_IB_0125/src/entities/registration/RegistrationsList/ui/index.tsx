import { observer } from 'mobx-react-lite';
import { tokens, TranslatedToken, useTranslation } from '@shared/utils/i18n';
import { useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useInjection } from 'inversify-react';
import { RegistrationModule } from '@mobx/services/registration';
import { Box, Card, Toolbar, Typography } from '@mui/material';
import { DataGridStyled } from '@entities/registration/RegistrationsList/ui/DataGridStyled';
import { GridRowParams } from '@mui/x-data-grid';

const RegistrationsList = observer(() => {
  const registrationModule = useInjection(RegistrationModule);
  const { translateToken: tt } = useTranslation();
  const columns = useMemo(
    () => [
      {
        field: 'createDt',
        headerName: tt(tokens.cabinetRoot.registrationTable.created),
        width: 200,
        type: 'dateTime',
        valueGetter: (params: any) => new Date(params.value).toLocaleString('ru-RU')
      },
      {
        field: 'stateName',
        headerName: tt(tokens.cabinetRoot.registrationTable.state),
        width: 150
        // valueGetter: (params) => params.row.stateName || params.value
      },
      { field: 'name', headerName: tt(tokens.cabinetRoot.registrationTable.name), width: 300 },
      { field: 'idn', headerName: tt(tokens.cabinetRoot.registrationTable.IDN), width: 150 },
      { field: 'address', headerName: tt(tokens.cabinetRoot.registrationTable.address), width: 400 }
    ],
    [tt]
  );

  const [sortModel, setSortModel] = useState([
    {
      field: 'createDt',
      sort: 'desc'
    }
  ]);
  const theme = useTheme();

  const selectRegistration = (params: GridRowParams): void => {
    if (!['CREATED', 'PREPARED'].includes(params.row.stateCode)) return;

    registrationModule.selectRegistration(params.id);
  };

  if (!Array.isArray(registrationModule.allRegistrations)) return null;
  return (
    <Card>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: theme.spacing(0, 1, 0, 3)
        }}
      >
        <Typography variant="h6" id="tableTitle" component="div">
          <TranslatedToken id={tokens.cabinetRoot.registrationListHeader} />
        </Typography>
      </Toolbar>

      <Box sx={{ height: 400 }}>
        <DataGridStyled
          pagination
          density="compact"
          pageSize={10}
          rowsPerPageOptions={[10]}
          sortModel={sortModel as any}
          onSortModelChange={(model) => setSortModel(model as any)}
          rows={registrationModule.allRegistrations}
          columns={columns}
          getRowClassName={(params) => `data-grid--${params.row.stateCode}`}
          onRowClick={selectRegistration}
        />
      </Box>
    </Card>
  );
});
export default RegistrationsList;
