import { Grid, Card, TextField, CardContent, FormControlLabel, Switch } from '@mui/material';

import { formatPhone } from '@shared/utils/helpers/formatString';
import { observer } from 'mobx-react-lite';
import { CHECKBOX_OPTIONS } from './constants';
import Docs from './docs';

interface Props {
  osi: any;
  docs: any;
}

export const OsiInfo: React.FC<Props> = observer(({ osi, docs }) => (
  <Grid container spacing={3} sx={{ mt: 0.2 }}>
    <Grid item xs={12} md={8}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField size={'small'} fullWidth label="Наименование ОСИ" value={osi.name} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField size={'small'} fullWidth label="БИН ОСИ" value={osi.idn} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField size={'small'} fullWidth label="ФИО Председателя" value={osi.fio} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField size={'small'} fullWidth label="Контактный телефон" value={formatPhone(osi.phone)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField size={'small'} fullWidth label="Email" value={osi.email} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField size={'small'} fullWidth label="Количество этажей" value={String(osi.floors || '')} />
            </Grid>
          </Grid>

          {CHECKBOX_OPTIONS.map((activity) => (
            <FormControlLabel
              sx={{
                '@media (min-width: 700px)': {
                  width: '50%'
                },
                '@media (max-width: 700px)': {
                  width: '100%'
                },
                marginRight: 0
              }}
              key={activity.value}
              control={<Switch color="primary" readOnly checked={osi[activity.value]} />}
              label={activity.label}
            />
          ))}
          {docs && Array.isArray(docs) && docs.length && <Docs docs={docs} />}
        </CardContent>
      </Card>
    </Grid>
  </Grid>
));
