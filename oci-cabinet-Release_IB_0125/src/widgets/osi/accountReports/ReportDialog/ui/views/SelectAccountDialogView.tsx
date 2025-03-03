import { Box, Button, DialogActions, DialogContent, IconButton, Typography } from '@mui/material';
import { AccountListLastMonth } from '@shared/types/osi/accountReports';
import { useTranslation } from '@shared/utils/i18n';
import { observer } from 'mobx-react-lite';
import CloseIcon from '@mui/icons-material/Close';
import clsx from 'clsx';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useReportDialogContext } from '@widgets/osi/accountReports/ReportDialog/model/context';
import { AccountReportsViewModel } from '@widgets/osi/accountReports/model/viewModel';

export const SelectAccountDialogView: React.FC = observer(() => {
  const viewModel = useReportDialogContext();
  const { fieldWithPrefix: fwp, t } = useTranslation();

  if (!(viewModel instanceof AccountReportsViewModel)) {
    return null;
  }

  const { accounts, allListsFilled } = viewModel;
  const selectAccountHandler = (account: AccountListLastMonth) => {
    viewModel.selectAccount(account);
  };
  const closeHandler = (e?: any, reason?: string) => {
    if (reason === 'backdropClick') return;
    viewModel.closeDialog();
  };
  return (
    <Box className={'view select-account'}>
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
          <Box className={'title'}>
            <Typography align={'center'}>{t('accountReports:forms.select.title')}</Typography>
          </Box>
          <Box className={'accounts-wrapper'}>
            {accounts.map((account) => (
              <Box
                className={clsx(['account', account.isFilled && 'filled'])}
                key={account?.id}
                onClick={() => selectAccountHandler(account)}
                sx={{
                  borderColor: (theme) => theme.palette.primary.main
                }}
              >
                <Typography align={'center'} className={'type'}>
                  {fwp(account, 'accountTypeName')}
                </Typography>
                <Typography
                  align={'center'}
                  className={'number'}
                  sx={(theme) => ({ color: account.isFilled ? 'green' : theme.palette.primary.main })}
                >
                  {account.account}
                </Typography>
              </Box>
            ))}
          </Box>
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
        {allListsFilled && (
          <Button variant={'outlined'} onClick={viewModel.publishReport}>
            {t('accountReports:publish')}
          </Button>
        )}
        <Button variant={'outlined'} onClick={closeHandler}>
          {t('common:close')}
        </Button>
      </DialogActions>
    </Box>
  );
});
