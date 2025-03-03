import { observer } from 'mobx-react-lite';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { useInjection } from 'inversify-react';
import LoadingScreen from '@shared/components/LoadingScreen';
import {
  IOsiServiceSaldoWidgetViewModel,
  IOsiServiceSaldoWidgetVmToken
} from '@shared/types/mobx/widgets/OsiServiceSaldo';
import { ServiceSaldoTable } from '@entities/osi/serviceSaldo';
import { useTranslation } from '@shared/utils/i18n';

export const OsiServiceSaldoWidget: React.FC = observer(() => {
  const vm = useInjection<IOsiServiceSaldoWidgetViewModel>(IOsiServiceSaldoWidgetVmToken);
  const { fieldWithPrefix: fwp } = useTranslation();

  if (vm.isLoading) return <LoadingScreen />;

  return (
    <>
      {vm.saldoByGroup.map((item, index) => (
        <Card key={index} sx={{ mb: 2, maxWidth: 1000, minWidth: 500 }}>
          <CardHeader
            subheader={
              <Box display="flex" alignItems="center">
                <Typography variant="h5" color="textPrimary">
                  {fwp(item, 'groupName')}
                </Typography>
              </Box>
            }
          />
          <CardContent>
            <ServiceSaldoTable rows={item.items} />
          </CardContent>
        </Card>
      ))}
    </>
  );
});
