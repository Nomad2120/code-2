import Page from '@shared/components/Page';
import { useInjection } from 'inversify-react';
import { Box, Container, Typography } from '@mui/material';
import { tokens, TranslatedToken } from '@shared/utils/i18n';
import { RoleList } from '@entities/roleList';
import { SelectRoleViewModel } from '@widgets/selectRole/model/SelectRoleViewModel';
import { UserRole } from '@mobx/interfaces';
import { observer } from 'mobx-react-lite';

export const SelectRoleView = observer((): JSX.Element | null => {
  const vm = useInjection(SelectRoleViewModel);

  const handleSelectRole = (role: UserRole) => {
    vm.selectRole(role);
  };

  return (
    <Page sx={{ display: { md: 'flex' } }} className={'h-full flex items-center'} title="Кабинет ОСИ | Выбор роли">
      <Container maxWidth="sm">
        <Box
          className="flex justify-center flex-col min-h-screen m-auto"
          sx={(theme) => ({
            padding: theme.spacing(12, 0)
          })}
        >
          <Typography variant="h4" gutterBottom>
            <TranslatedToken id={tokens.roles.title} />
          </Typography>
          <RoleList roles={vm.roles ?? []} onSelectRole={handleSelectRole} />
        </Box>
      </Container>
    </Page>
  );
});
export default SelectRoleView;
