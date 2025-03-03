import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { tokens, useTranslation } from '../../utils/i18n';

const formatNum = (num) =>
  new Intl.NumberFormat('kz-KZ', {
    // style: 'currency',
    // currency: 'KZT',
    maximumFractionDigits: 2
  }).format(num);

const getTotal = (totals, formatFunc) => (index) =>
  totals && totals.length && totals[index] ? formatFunc(totals[index]) : 0;

const StateFooter = ({ totals }) => {
  const total = getTotal(totals, formatNum);
  const { translateToken: tt } = useTranslation();

  return (
    <Grid container spacing={2} direction="row" justifyContent="flex-end">
      <Grid item xs={12} md={3}>
        <StateItem title={tt(tokens.osiOSV.table.footer.startOsv)} value={total(0)} />
      </Grid>
      <Grid item xs={12} md={2}>
        <StateItem title={tt(tokens.osiOSV.table.footer.accrued)} value={total(1)} />
      </Grid>
      <Grid item xs={12} md={2}>
        <StateItem title={tt(tokens.osiOSV.table.footer.fixes)} value={total(2)} />
      </Grid>
      <Grid item xs={12} md={2}>
        <StateItem title={tt(tokens.osiOSV.table.footer.payed)} value={total(3)} />
      </Grid>
      <Grid item xs={12} md={2}>
        <StateItem title={tt(tokens.osiOSV.table.footer.debt)} value={total(4)} />
      </Grid>
    </Grid>
  );
};

StateFooter.propTypes = { totals: PropTypes.any };

const StateItem = ({ title, value }) => (
  <>
    <Typography component="span" sx={{ pl: 2, pr: 2 }}>
      {title}
    </Typography>
    <Typography component="span" sx={{ color: 'primary.main' }}>
      {value}
    </Typography>
  </>
);

StateItem.propTypes = { title: PropTypes.string, value: PropTypes.any };

export default StateFooter;
