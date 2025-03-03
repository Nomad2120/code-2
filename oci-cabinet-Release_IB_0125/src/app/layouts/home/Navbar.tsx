import { observer } from 'mobx-react-lite';
import { useScreens } from '@shared/hooks/useScreens';
import { NavLink } from 'react-router-dom';
import logo from '@shared/icons/logo.png';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import { Link } from '@mui/material';
import { NavbarLanguageSelect } from '@widgets/navbarLanguageSwitch';
import { tokens, TranslatedToken } from '@shared/utils/i18n';
import { PATH_AUTH } from '@app/routes/paths';
import useOffSetTop from '@shared/hooks/useOffSetTop';
import clsx from 'clsx';
import classes from './styles/navbar.module.scss';

export const Navbar: React.FC = observer(() => {
  const isOffset = useOffSetTop(100);
  const { isMobile } = useScreens();
  return (
    <div className={clsx([classes.homeNavbar, isOffset && classes.shadow])}>
      <div className={classes.container}>
        <div className={'logo-wrapper'}>
          <NavLink to="/">
            <img src={logo} alt="EOSI" width="100%" height="100%" />
          </NavLink>
        </div>
        <div className={'content-wrapper'}>
          {!isMobile && (
            <div className={'phone'}>
              <AddIcCallIcon
                className={'phone--icon'}
                fontSize="small"
                color={'primary'}
                sx={{
                  mr: 1
                }}
              />
              <Link href={'tel:+77076825676'} color={'primary'} fontWeight={600}>
                <span>+7 707 682 56 76</span>
              </Link>
            </div>
          )}

          <div className={'language'}>
            <NavbarLanguageSelect />
          </div>
          <div className={'button-panel'}>
            <NavLink className={'button contained'} to={PATH_AUTH.login}>
              <button type={'button'}>
                <span>
                  <TranslatedToken id={tokens.common.login} />
                </span>
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
});
