import {
  Box,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  Card,
  CardContent,
  Grid
} from '@mui/material';

import { observer } from 'mobx-react-lite';
import Scrollbar from '../../../shared/components/Scrollbar';

interface Props {
  companies: any;
}

export const ServiceCompaniesList: React.FC<Props> = observer(({ companies }) => (
  <Grid container spacing={3} sx={{ mt: 0.2 }}>
    <Grid item xs={12} md={8}>
      <Card>
        {!Array.isArray(companies) || companies.length === 0 ? (
          <CardContent>Отсутствуют</CardContent>
        ) : (
          // @ts-expect-error not typed component
          <Scrollbar>
            <TableContainer component={Box} sx={{ mt: 3, mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Тип</TableCell>
                    <TableCell>Телефоны</TableCell>
                    <TableCell>Адреса</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companies.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.serviceCompanyNameRu}
                      </TableCell>
                      <TableCell>{row.phones}</TableCell>
                      <TableCell>{row.addresses}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        )}
      </Card>
    </Grid>
  </Grid>
));
