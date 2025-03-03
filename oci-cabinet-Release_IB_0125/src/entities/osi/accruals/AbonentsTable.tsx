import { observer } from 'mobx-react-lite';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { Button, Card, CardActions, CardContent, CardHeader, LinearProgress } from '@mui/material';
import { JSXElementConstructor } from 'react';

interface Props {
  abonents: any[];
  ToolbarComponent?: JSXElementConstructor<any | null | undefined>;
}

export const AbonentsTable: React.FC<Props> = observer(({ abonents, ToolbarComponent }) => {
  const columns: GridColDef[] = [
    {
      field: 'flat',
      headerName: 'Помещение',
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'areaTypeNameRu',
      headerName: 'Тип',
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'name',
      headerName: 'Собственник помещения',
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'floor',
      headerName: 'этаж',
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'square',
      headerName: 'площадь',
      align: 'center',
      headerAlign: 'center'
    }
  ];
  return (
    <Card>
      <CardHeader />
      <CardContent>
        <DataGridPro
          rows={abonents}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
          density="compact"
          components={{
            LoadingOverlay: LinearProgress,
            Toolbar: ToolbarComponent
          }}
          experimentalFeatures={{ newEditingApi: true }}
          rowHeight={35}
        />
      </CardContent>
      <CardActions>
        <Button>Cancel</Button>
        <Button>Close</Button>
      </CardActions>
    </Card>
  );
});
