import { Outlet, Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Logo } from '@shared/ui/logos';
import { observer } from 'mobx-react-lite';

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0)
  }
}));

const HomeLink = styled(RouterLink)(() => ({
  display: 'block',
  width: '90px'
}));

const LogoOnlyLayout: React.FC = observer(() => (
  <>
    <HeaderStyle>
      <HomeLink to="/">
        <Logo />
      </HomeLink>
    </HeaderStyle>
    <Outlet />
  </>
));

export default LogoOnlyLayout;
