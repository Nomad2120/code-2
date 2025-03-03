import { HelmetProvider } from 'react-helmet-async';
import { rootContainer } from '@mobx/root';
import NotistackProvider from '@shared/components/NotistackProvider';
import { observer } from 'mobx-react-lite';
import { Provider as DIProvider } from 'inversify-react';
import ThemePrimaryColor from '@shared/components/ThemePrimaryColor';
import RtlLayout from '@shared/components/RtlLayout';
import { queryClient } from '@shared/api/reactQuery';
import { QueryClientProvider } from '@tanstack/react-query';
import { SettingsProvider } from '../contexts/SettingsContext';
import { CollapseDrawerProvider } from '../contexts/CollapseDrawerContext';
import ThemeConfig from '../../shared/theme';
import { LanguageConfig } from './languageConfig';
import { DateTimeLocalizationProvider } from './DateTimeLocalizationProvider';

// TODO: перенести Instructions на самый верхний уровень - чтобы был доступен между страницами

export const Providers = observer(({ children }: { children: JSX.Element }) => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <DIProvider container={rootContainer}>
        <SettingsProvider>
          <CollapseDrawerProvider>
            <ThemeConfig>
              <ThemePrimaryColor>
                <RtlLayout>
                  <NotistackProvider autoHideDuration={1500}>
                    {/* <LoadingWrapper> */}
                    <LanguageConfig>
                      <DateTimeLocalizationProvider>{children}</DateTimeLocalizationProvider>
                    </LanguageConfig>
                    {/* </LoadingWrapper> */}
                  </NotistackProvider>
                </RtlLayout>
              </ThemePrimaryColor>
            </ThemeConfig>
          </CollapseDrawerProvider>
        </SettingsProvider>
      </DIProvider>
    </QueryClientProvider>
  </HelmetProvider>
));
