import { Card, CardContent, Stack, Typography } from '@mui/material';
import { UserRole } from '@mobx/interfaces';
import { useTranslation } from '@shared/utils/i18n';

interface Props {
  roles: UserRole[];
  onSelectRole: (role: UserRole) => void;
}

export const RoleList = ({ roles, onSelectRole }: Props): JSX.Element | null => {
  const { fieldWithPrefix: fwp } = useTranslation();
  if (!roles.length) return <Typography>Нет ролей</Typography>;
  return (
    <Stack spacing={2} direction="row" justifyContent="center">
      {roles.map((role, idx) => (
        <Card
          sx={(theme: any) => ({
            height: theme.spacing(20),
            width: theme.spacing(40),
            color: theme.palette.primary.darker,
            backgroundColor: theme.palette.primary.lighter,
            boxShadow: (theme: any) => theme.customShadows.z8,
            textAlign: 'center',
            '&:hover': {
              backgroundColor: `${theme.palette.secondary.lighter} !important`,
              boxShadow: `${theme.shadows[4]} !important`,
              '@media (hover: none)': {
                boxShadow: `${theme.shadows[2]} !important`,
                backgroundColor: `${theme.palette.secondary.lighter} !important`
              }
            }
          })}
          key={idx}
          onClick={() => {
            onSelectRole(role);
          }}
          data-test-id={`role-${role.role}`}
        >
          <CardContent sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography className="cursor-pointer" variant="h4">
              {' '}
              {fwp(role, 'name')}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};
