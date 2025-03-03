import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import {
  IPrintServiceCheckboxFeatureViewModel,
  IPrintServiceCheckboxFeatureViewModelToken
} from '@shared/types/mobx/features/OsiServiceCompanies';
import { OsiServiceCompany } from '@shared/types/osi/osiServiceCompanies';
import { Checkbox } from '@mui/material';
import { useEffect } from 'react';

interface Props {
  serviceCompany: OsiServiceCompany;
}

export const PrintServiceCheckbox: React.FC<Props> = observer(({ serviceCompany }) => {
  const vm = useInjection<IPrintServiceCheckboxFeatureViewModel>(IPrintServiceCheckboxFeatureViewModelToken);

  useEffect(() => {
    vm.serviceCompany = serviceCompany;
  }, [serviceCompany, vm]);

  return <Checkbox checked={vm.isChecked} onClick={vm.onClick} />;
});
