import { tokens } from '@shared/utils/i18n';
import { OsiServiceCompaniesWidget } from '@widgets/osi/osiServiceCompanies';
import { OsiAccrualsWidget } from '@widgets/osi/accruals';
import { OsiServiceSaldoWidget } from '@widgets/osi/osiServiceSaldo';
import { OsiAbonentsWidget } from '@widgets/osi/abonents';

export const lastStep = 3;

export const steps = [
  {
    // doesn`t use first step because need extended logic
    label: 'Сведения об ОСИ',
    labelToken: tokens.osiWizard.steps.step1,
    render: () => <span />,
    active: false,
    videoId: 'TLVOT0KGy-c',
    step: 0
  },
  {
    label: 'Сервисные компании',
    labelToken: tokens.osiWizard.steps.step2,
    render: () => <OsiServiceCompaniesWidget />,
    active: true,
    videoId: '506mtsHw0HM',
    step: 0
  },
  {
    code: 'abonents',
    label: 'Помещения',
    labelToken: tokens.osiWizard.steps.step3,
    render: (props: any) => <OsiAbonentsWidget {...props} />,
    active: false,
    videoId: 'mdqp3yrcyUw',
    step: 1
  },
  {
    code: 'accruals',
    label: 'План начислений',
    labelToken: tokens.osiWizard.steps.step5,
    render: (props: any) => <OsiAccrualsWidget {...props} />,
    active: false,
    videoId: 'wIT7YkSGFcA',
    step: 2
  },
  {
    label: 'Начальное сальдо абонентов',
    labelToken: tokens.osiWizard.steps.step6,
    render: () => <OsiServiceSaldoWidget />,
    active: false,
    videoId: 'k_rCia2Zbf0',
    step: 3
  }
];
