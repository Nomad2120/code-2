import { Box, Button, DialogActions, DialogContent, IconButton, Link, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { observer } from 'mobx-react-lite';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { AccountReportsViewModel } from '@widgets/osi/accountReports/model/viewModel';
import { ViewMode } from '@widgets/osi/accountReports/ReportDialog/model/type';
import { Icon } from '@iconify/react';
import { Trans } from 'react-i18next';
import { useTranslation } from '@/shared/utils/i18n';
import { useReportDialogContext } from '../../model/context';

export const EntryDialogView: React.FC = observer(() => {
  const viewModel = useReportDialogContext();
  const { getMoment, t } = useTranslation();

  if (!(viewModel instanceof AccountReportsViewModel)) {
    return null;
  }

  const osiName = viewModel?.osiInfo.name;
  const period = getMoment().subtract(1, 'month').format('MMMM');
  const filledListsCount = viewModel.lastMonthFilledListsCount;
  const { allListsFilled } = viewModel;

  const instructionLink = 'https://www.youtube.com/watch?v=RFIgTdEQ4A0';

  const closeHandler = (e?: any, reason?: string) => {
    if (reason === 'backdropClick') return;
    viewModel.closeDialog();
  };

  const selectAccount = () => {
    viewModel.changeViewMode(ViewMode.Select_account);
  };

  const publishReport = () => {
    viewModel.publishReport();
  };

  return (
    <Box className={'view entry'}>
      <Box className={'header-wrapper'}>
        <IconButton
          aria-label="close"
          onClick={closeHandler}
          size={'small'}
          sx={{
            color: (theme) => theme.palette.primary.main,
            border: (theme) => `1px solid ${theme.palette.primary.main}`,
            borderRadius: '8px'
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent className={'content-wrapper'}>
        <Box className={'content'}>
          {filledListsCount === 0 && !allListsFilled && (
            <Typography align={'center'} variant={'subtitle2'} sx={{ mb: 4, fontSize: '0.75rem' }}>
              <Trans
                i18nKey={'accountReports:forms.entry.info'}
                t={t}
                components={{
                  Component: (
                    <Link
                      target={'_blank'}
                      rel={'noopener'}
                      underline={instructionLink ? 'always' : 'none'}
                      href={instructionLink}
                    />
                  ),
                  Icon: <Icon icon={'logos:youtube-icon'} style={{ display: 'inline', marginLeft: '5px' }} />
                }}
              />
            </Typography>
          )}
          <Typography align={'center'}>{t('accountReports:forms.entry.title', { osiName })}</Typography>
          {filledListsCount === 0 && !allListsFilled && (
            <Typography align={'center'}>
              {t('accountReports:forms.entry.notFilled', {
                period
              })}
            </Typography>
          )}
          {filledListsCount === 1 && !allListsFilled && (
            <Typography align={'center'}>{t('accountReports:forms.entry.oneFilled')}</Typography>
          )}
          {allListsFilled && <Typography align={'center'}>{t('accountReports:forms.entry.notPublished')}</Typography>}
          {allListsFilled && (
            <Box className={'warning mt-5'}>
              <Box className={'icon-wrapper'}>
                <ErrorOutlineIcon />
              </Box>
              <Typography variant={'body2'} className={'text'} align={'center'}>
                {t('accountReports:publishWarning')}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions className={'actions-wrapper'}>
        {allListsFilled ? (
          <Button variant={'outlined'} onClick={publishReport}>
            {t('accountReports:publish')}
          </Button>
        ) : (
          <Button variant={'outlined'} onClick={selectAccount}>
            {t('accountReports:fillReport')}
          </Button>
        )}

        <Button variant={'outlined'} onClick={closeHandler}>
          {t('common:close')}
        </Button>
      </DialogActions>
    </Box>
  );
});
