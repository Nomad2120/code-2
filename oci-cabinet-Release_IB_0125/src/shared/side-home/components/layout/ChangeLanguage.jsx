import { useRef, useEffect } from 'react';
import { SettingsStore } from '@mobx/services/SettingsStore';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { LOCALES } from '@shared/utils/i18n/locales';
import { useTranslation } from '@shared/utils/i18n';

const LanguageSelector = observer(() => {
  const settingsStore = useInjection(SettingsStore);
  const { intl } = useTranslation();
  const ruButtonRef = useRef(null);
  const kzButtonRef = useRef(null);

  useEffect(() => {
    const currentLanguage = intl.locale;
    ruButtonRef.current.style.color = currentLanguage === 'ru-RU' ? 'white' : 'rgba(255, 255, 255, 0.5)';
    kzButtonRef.current.style.color = currentLanguage === 'kz-KZ' ? 'white' : 'rgba(255, 255, 255, 0.5)';
  }, [intl.locale]);

  const changeLanguage = (lng) => {
    settingsStore.changeLanguage(lng);
  };

  return (
    <div className="d-flex align-items-center language-buttons">
      <button
        type={'button'}
        ref={ruButtonRef}
        onClick={() => changeLanguage(LOCALES.RU)}
        className="pl-0"
        style={{ fontSize: '17px', fontWeight: '600' }}
      >
        RU
      </button>
      <div className="vl" />
      <button
        type={'button'}
        ref={kzButtonRef}
        onClick={() => changeLanguage(LOCALES.KZ)}
        className="pr-0"
        style={{ fontSize: '17px', fontWeight: '600' }}
      >
        KZ
      </button>
    </div>
  );
});

export default LanguageSelector;
