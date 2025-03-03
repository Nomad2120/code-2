import * as React from 'react';
import { Box, CardActionArea, FormControlLabel, Grid, Paper, Radio, RadioGroup, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DefaultTheme, useTheme } from '@mui/styles';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { SettingsStore } from '@mobx/services/SettingsStore';
import { LOCALE, LOCALES } from '../../utils/i18n/locales';

export const SettingsLanguage = observer(() => {
  const settingsStore = useInjection(SettingsStore);

  const changeLanguage = (e: React.ChangeEvent<HTMLInputElement>) => {
    settingsStore.changeLanguage(e.target.value as LOCALE);
  };

  return (
    <RadioGroup
      sx={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      name="Language"
      value={settingsStore.locale}
      onChange={changeLanguage}
    >
      <Grid container spacing={1.5} dir="ltr" justifyContent="center">
        <Languages />
      </Grid>
    </RadioGroup>
  );
});

const Languages = observer(() => {
  const settingsStore = useInjection(SettingsStore);
  const theme: DefaultTheme & { palette: any } = useTheme();

  const mainColor = theme.palette.primary.main;
  const languages = Object.keys(LOCALES) as [keyof typeof LOCALES];
  return (
    <>
      {languages.map((lang) => {
        const isSelected = settingsStore.locale === LOCALES[lang];
        return (
          <Grid item xs={4} key={lang}>
            <Paper
              variant={isSelected ? 'elevation' : 'outlined'}
              sx={{
                ...(isSelected && {
                  bgcolor: alpha(mainColor, 0.12),
                  border: `solid 2px ${mainColor}`,
                  boxShadow: `inset 0 4px 8px 0 ${alpha(mainColor, 0.24)}`
                })
              }}
            >
              <CardActionArea sx={{ borderRadius: 1, color: mainColor }}>
                <Box
                  sx={{
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography color={theme.palette.text.primary}>{lang}</Typography>
                </Box>
                <FormControlLabel
                  label=""
                  value={LOCALES[lang]}
                  control={<Radio sx={{ display: 'none' }} />}
                  sx={{
                    top: 0,
                    margin: 0,
                    width: '100%',
                    height: '100%',
                    position: 'absolute'
                  }}
                />
              </CardActionArea>
            </Paper>
          </Grid>
        );
      })}
    </>
  );
});
