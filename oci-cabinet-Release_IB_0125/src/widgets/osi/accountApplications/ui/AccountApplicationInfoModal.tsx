import { observer } from 'mobx-react-lite';
import { IOsiAccountApplicationsWidgetViewModel } from '@shared/types/mobx/widgets/OsiAccountApplications';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DnDApplicationDoc } from '@widgets/osi/accountApplications/ui/DnDApplicationDoc';
import { AccountApplicationDocs } from '@widgets/osi/accountApplications/ui/AccountApplicationDocs';
import { useTranslation } from '@shared/utils/i18n';
import { ApplicationTypes } from '@shared/types/osiAccountApplications';
import { ApplicationAddFullInfoBlock } from '@widgets/osi/accountApplications/ui/ApplicationAddFullInfoBlock';
import { ApplicationUpdateFullInfoBlock } from '@widgets/osi/accountApplications/ui/ApplicationUpdateFullInfoBlock';
import { RejectReasonBlock } from '@widgets/osi/accountApplications/ui/RejectReasonBlock';

interface Props {
  vm: IOsiAccountApplicationsWidgetViewModel;
}

export const AccountApplicationInfoModal: React.FC<Props> = observer(({ vm }) => {
  const { t } = useTranslation();
  const { isOpen, application } = vm.infoModal;

  return (
    <Dialog open={isOpen} onClose={vm.closeApplicationInfo}>
      <DialogTitle sx={{ marginBlockEnd: '1rem' }}>{t('accountApplications:fullInfo.header')}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {application?.applicationType === ApplicationTypes.ADD ? (
          <ApplicationAddFullInfoBlock application={application} />
        ) : (
          <ApplicationUpdateFullInfoBlock application={application} />
        )}
        <Box>
          {vm.isSelectedApplicationHasDocs ? (
            <AccountApplicationDocs docs={vm.infoModal.docs} file={vm.infoModal.file as any} />
          ) : (
            <DnDApplicationDoc vm={vm} />
          )}
        </Box>
        {application?.rejectReason && <RejectReasonBlock reasonText={application.rejectReason} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={vm.closeApplicationInfo}>{t('common:close')}</Button>
      </DialogActions>
    </Dialog>
  );
});
