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
  accounts: any;
}

export const Accounts: React.FC<Props> = observer(({ accounts }) => (
  <Grid container spacing={3} sx={{ mt: 0.2 }}>
    <Grid item xs={12} md={8}>
      <Card>
        {!Array.isArray(accounts) || accounts.length === 0 ? (
          <CardContent>Отсутствуют</CardContent>
        ) : (
          // @ts-expect-error not typed component
          <Scrollbar>
            <TableContainer component={Box} sx={{ mt: 3, mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Тип счета</TableCell>
                    <TableCell>Счет</TableCell>
                    <TableCell>БИК Банка</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.accountTypeNameRu}
                      </TableCell>
                      <TableCell>{row.account}</TableCell>
                      <TableCell>{row.bic}</TableCell>
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
