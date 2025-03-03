import { observer } from 'mobx-react-lite';
import { IntlProvider } from 'react-intl';
import { messages } from '@shared/utils/i18n';
import { LOCALES } from '@shared/utils/i18n/locales';
import { useInjection } from 'inversify-react';
import { SettingsStore } from '@mobx/services/SettingsStore';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const LanguageConfig: React.FC<Props> = observer(({ children }) => {
  const settings = useInjection(SettingsStore);
  const { locale } = settings;

  return (
    <IntlProvider messages={messages[locale]} defaultLocale={LOCALES.RU} locale={locale}>
      {children}
    </IntlProvider>
  );
});
