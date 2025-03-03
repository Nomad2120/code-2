import { Link as RouterLink } from 'react-router-dom';
import { Logo } from '@shared/ui/logos';
import { observer } from 'mobx-react-lite';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7)
  }
}));

interface Props {
  children: ReactNode;
}

export const Header: React.FC<Props> = observer(({ children }) => (
  <HeaderStyle>
    <RouterLink to="/">
      <Logo />
    </RouterLink>
    {children}
  </HeaderStyle>
));
