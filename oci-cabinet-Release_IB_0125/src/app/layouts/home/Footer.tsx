import { observer } from 'mobx-react-lite';
import { Link } from '@mui/material';
import { Link as ScrollLink } from 'react-scroll/modules';
import { tokens, useTranslation } from '@shared/utils/i18n';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import { useScreens } from '@shared/hooks/useScreens';
import logo from '@shared/icons/logo.png';
import classes from './styles/footer.module.scss';

export const Footer: React.FC = observer(() => {
  const { translateToken: tt } = useTranslation();
  const isMobile = useScreens();

  return (
    <div className={classes.homeLayoutFooter}>
      <div className={classes.container}>
        <ScrollLink to="move_top" spy smooth>
          <img className={classes.logo} src={logo} alt="EOSI" width="100%" height="100%" />
        </ScrollLink>

        <div className={classes.linksWrapper}>
          <span className={classes.copyright}>{`© ${tt(tokens.common.copyright)}`}</span>
          <br />
          <Link href="http://eosi.kz/">eosi.kz</Link>
          <br />
          <div className={classes.containerCenter}>
            <AlternateEmailIcon fontSize="small" className={classes.icon} />
            <Link href="mailto: info@eosi.kz">info@eosi.kz</Link>
          </div>
          {!isMobile && (
            <div className={classes.containerCenter}>
              <WhatsAppIcon fontSize="small" className={classes.icon} />
              <Link href="https://wa.me/7782044493">+7 778 204 44 93</Link>
            </div>
          )}
          {isMobile && (
            <div className={classes.containerCenter}>
              <AddIcCallIcon fontSize="small" className={classes.icon} />
              <Link href="tel:+77076825676">+7 707 682 56 76</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
