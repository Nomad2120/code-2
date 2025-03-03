import { LicenseInfo } from '@mui/x-license-pro';
import { observer } from 'mobx-react-lite';
import '@app/styles/app.scss';
import { Providers as SetupProviders } from '@app/setup/setupProviders';
import { RouterProvider } from 'react-router-dom';
import { router } from '@app/routes';
import LogRocket from 'logrocket';

LicenseInfo.setLicenseKey(
  '9eba21ae66af1bdc594c0068edb42709Tz04NDIyMCxFPTE3Mzk1MTM1ODIwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI='
);

LogRocket.init('zewdav/osi');

export const App = observer(() => (
  <SetupProviders>
    <RouterProvider router={router} />
  </SetupProviders>
));
