import 'reflect-metadata';
import 'simplebar/src/simplebar.css';
import '@shared/utils/i18next';

import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import Logger from 'js-logger';
import { App } from '@app/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById('root') as HTMLElement);

// eslint-disable-next-line react-hooks/rules-of-hooks
Logger.useDefaults();

root.render(
  <StrictMode>
    <Suspense fallback={'loading'}>
      <App />
    </Suspense>
  </StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

reportWebVitals();
