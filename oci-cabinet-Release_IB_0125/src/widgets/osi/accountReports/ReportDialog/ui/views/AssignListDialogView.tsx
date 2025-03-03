import { Box, Button, DialogActions, DialogContent, IconButton, Link, Typography } from '@mui/material';
import logger from 'js-logger';
import { observer } from 'mobx-react-lite';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useReportDialogContext } from '@widgets/osi/accountReports/ReportDialog/model/context';
import { ViewMode } from '@widgets/osi/accountReports/ReportDialog/model/type';
import { AllAccountReportsViewModel } from '@widgets/osi/accountReports/allAccountReports/model/viewModel';
import moment from 'moment';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Trans, useTranslation } from 'react-i18next';

export const AssignListDialogView: React.FC = observer(() => {
  const viewModel = useReportDialogContext();
  const { t } = useTranslation();

  if (!viewModel || !viewModel?.reportDialog) return null;

  const { selectedAccount, selectedReport } = viewModel.reportDialog;

  const period = selectedReport
    ? `${moment(selectedReport?.period).format('DD.MM.YYYY')} - ${moment(selectedReport?.period)
        .endOf('month')
        .format('DD.MM.YYYY')}`
    : '';
  const assignListHandler = (e: any) => {
    const file = e.target.files[0];
    viewModel.assignFile(file);
  };
  const backHandler = () => {
    if (viewModel instanceof AllAccountReportsViewModel) {
      viewModel.closeAssignList();
      return;
    }
    viewModel.changeViewMode(ViewMode.Select_account);
  };

  const bankLink = selectedAccount?.bankStatementVideoUrl;

  return (
    <Box className={'view assign-list'}>
      <DialogContent className={'content-wrapper'}>
        <Box className={'content-inner'}>
          <Box className={'flex max-w-xs'}>
            <Box className={'selected-account'}>
              <Typography align={'center'}>{selectedAccount?.accountTypeNameRu}</Typography>
              <Typography align={'center'}>{selectedAccount?.account}</Typography>
            </Box>
            <Box>
              <IconButton
                size={'small'}
                color={'primary'}
                disabled={!bankLink}
                onClick={() => {
                  window.open(bankLink, '_blank', 'noopener,noreferrer');
                }}
              >
                <HelpOutlineIcon />
              </IconButton>
            </Box>
          </Box>
          <Box className={'upload-button'}>
            <label htmlFor="upload-button-file">
              <input
                hidden
                id="upload-button-file"
                type="file"
                onChange={assignListHandler}
                onClick={(event) => ((event.target as any).value = '')}
              />
              <Button variant={'outlined'} component="span">
                {t('accountReports:assignList')}
              </Button>
            </label>
          </Box>
          <Box className={'warning'}>
            <Box className={'icon-wrapper'}>
              <ErrorOutlineIcon />
            </Box>
            <Typography variant={'body2'} className={'text'} align={'center'}>
              <Trans
                i18nKey={'accountReports:forms.assign.instruction'}
                t={t}
                values={{ period }}
                components={{
                  BankLink: (
                    <Link target={'_blank'} rel={'noopener'} underline={bankLink ? 'always' : 'none'} href={bankLink} />
                  )
                }}
              />
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className={'actions-wrapper'}>
        <Button variant={'outlined'} onClick={backHandler}>
          {t('common:close')}
        </Button>
      </DialogActions>
    </Box>
  );
});
