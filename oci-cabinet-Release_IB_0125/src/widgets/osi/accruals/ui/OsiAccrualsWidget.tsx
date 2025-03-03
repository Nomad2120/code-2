import { observer } from 'mobx-react-lite';
import { PenaltiesToggle } from '@features/osi/accruals/penaltiesToggle';
import { Box } from '@mui/material';
import { ServiceTable } from '@entities/osi/accruals/serviceTable';
import { ServiceGroup } from '@entities/osi/accruals/serviceGroup';
import {
  IOsiAccrualsWidgetViewModel,
  token as IOsiAccrualsWidgetVM
} from '@shared/types/mobx/widgets/OsiAccrualsWidget';
import { useInjection } from 'inversify-react';
import { AddServiceButton } from '@features/osi/accruals/service/add';
import LoadingScreen from '@shared/components/LoadingScreen';
import { useTranslation } from '@shared/utils/i18n';
import { AddAdditionalServiceButton } from '@features/osi/accruals/additionalService/add';
import { AccuralDate } from '@features/osi/accruals/accuralsDate';
import { RemakeAccruals } from '@features/osi/accruals/remakeAccruals/RemakeAccruals';

const EXTERNAL_GROUP_ID = 7;

const isExternalServiceGroup = (groupId: number | undefined) => groupId === EXTERNAL_GROUP_ID;

interface Props {
  hideSetDate?: boolean;
}

export const OsiAccrualsWidget: React.FC<Props> = observer(({ hideSetDate }) => {
  const vm = useInjection<IOsiAccrualsWidgetViewModel>(IOsiAccrualsWidgetVM);
  const { fieldWithPrefix: fwp } = useTranslation();
  return (
    <Box>
      {hideSetDate ? null : <AccuralDate />}
      <Box sx={{ display: 'flex', columnGap: '10px', alignItems: 'center' }}>
        <PenaltiesToggle />
        {vm.isCanRemakeAccruals && <RemakeAccruals />}
      </Box>

      {vm.isLoading ? (
        <div
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 1001,
            width: '100vw',
            height: '100vh'
          }}
        >
          <LoadingScreen />
        </div>
      ) : (
        <>
          {vm.serviceGroups.map((group) => (
            <ServiceGroup
              key={group.id}
              title={fwp(group, 'groupName')}
              RightTitleSlot={
                isExternalServiceGroup(group.id) ? (
                  <AddAdditionalServiceButton
                    serviceGroupId={group.id ?? 0}
                    reloadCb={vm.reloadServiceGroups}
                    defaultServiceNames={group.serviceNameExamples ?? []}
                  />
                ) : (
                  <AddServiceButton
                    serviceGroupId={group.id ?? 0}
                    accrualMethods={group.accuralMethods ?? []}
                    defaultServiceNames={group.serviceNameExamples ?? []}
                    reloadCb={vm.reloadServiceGroups}
                  />
                )
              }
            >
              <ServiceTable group={group} reloadCb={vm.reloadServiceGroups} />
            </ServiceGroup>
          ))}
        </>
      )}
    </Box>
  );
});
