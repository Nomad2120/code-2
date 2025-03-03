import { tokens } from '@shared/utils/i18n';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
import { PATH_CABINET } from '@app/routes/paths';

export const MENU_OPTIONS = [
  { label: 'Мой профиль', labelToken: tokens.common.myProfile, icon: settings2Fill, linkTo: PATH_CABINET.user }
];
