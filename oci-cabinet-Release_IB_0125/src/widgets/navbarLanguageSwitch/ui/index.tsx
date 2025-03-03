import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { LOCALE, LOCALES } from '@shared/utils/i18n/locales';
import { useInjection } from 'inversify-react';
import { SettingsStore } from '@mobx/services/SettingsStore';
import { observer } from 'mobx-react-lite';

export const NavbarLanguageSelect: React.FC = observer(() => {
  const settingsStore = useInjection(SettingsStore);
  const languages = Object.keys(LOCALES) as [keyof typeof LOCALES];

  const handleChange = (event: SelectChangeEvent) => {
    settingsStore.changeLanguage(event.target.value as LOCALE);
  };

  return (
    <FormControl variant="standard">
      <Select
        value={settingsStore.locale}
        onChange={handleChange}
        sx={(theme) => ({ color: theme.palette.primary.main })}
      >
        {languages.map((lang) => (
          <MenuItem key={lang} value={LOCALES[lang]}>
            {lang}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});
