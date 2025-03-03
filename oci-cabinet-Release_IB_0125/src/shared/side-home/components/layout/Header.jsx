import { Col, Button, OverlayTrigger, Tooltip, Image, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { PATH_AUTH } from '@app/routes/paths';
import { tokens, TranslatedToken } from '@shared/utils/i18n';
import { NavLink } from 'react-router-dom';
import LanguageSelector from './ChangeLanguage';

const Header = () => {
  const { t } = useTranslation();

  return (
    <Container className="p-0">
      <Row className="d-flex justify-content-between align-items-center header p-2">
        <Col lg={2} md={2} className="d-none d-lg-block pl-0">
          <Image src="/img/logo.png" className="logo" />
        </Col>
        <Col lg={10} md={10} className="d-none d-lg-block">
          <div className="d-flex align-items-center justify-content-end">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-inner">{t('home:tooltip')}</Tooltip>}
              arrow={false}
            >
              <div className="phone me-4">
                <a href="tel:+77076825676" className="d-flex align-items-center justify-content-end p-0">
                  <Image src="/img/call-new.png" className="me-2 itooltip itooltip-phone" />
                  <p className="phone-number" style={{ fontWeight: '600' }}>
                    +7 (707) 682-56-76
                  </p>
                  <Image src="/img/itooltip.png" className="ms-2 itooltip" />
                </a>
              </div>
            </OverlayTrigger>
            <LanguageSelector className="mr-3" />
            <NavLink className={'button contained'} to={PATH_AUTH.login}>
              <Button variant="custom" id="login-btn">
                <span>
                  <TranslatedToken id={tokens.common.login} />
                </span>
              </Button>
            </NavLink>
          </div>
        </Col>

        <Col xs={12} className="d-block d-lg-none p-0">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Image src="/img/logo.png" className="logo" />
            </div>
            <div>
              <NavLink className={'button contained'} to={PATH_AUTH.login}>
                <span>
                  <Button variant="custom" id="login-btn">
                    {t('home:btn.login')}
                  </Button>
                </span>
              </NavLink>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-2">
            <LanguageSelector />
            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-inner">{t('home:tooltip')}</Tooltip>}>
              <div className="phone" style={{ fontSize: '17px' }}>
                <a href="tel:+77076825676" className="d-flex align-items-center justify-content-end">
                  <Image src="/img/call-new.png" className="me-2 itooltip" />
                  +7 (707) 682-56-76
                  <Image src="/img/itooltip.png" className="ms-2 itooltip" />
                </a>
              </div>
            </OverlayTrigger>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
