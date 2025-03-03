import listFill from '@iconify/icons-eva/list-fill';
import { tokens } from '@shared/utils/i18n';
import { PATH_CABINET } from '@app/routes/paths';

const sidebarConfig = [
  {
    subheaderToken: tokens.common.menu,
    items: [
      {
        code: 'info',
        titleToken: tokens.cabinetRoot.appList,
        path: PATH_CABINET.root,
        active: true,
        icon: listFill
      }
    ]
  }
];

export default sidebarConfig;
