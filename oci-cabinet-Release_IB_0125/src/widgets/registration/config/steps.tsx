import { tokens } from '@shared/utils/i18n';
import RegistrationSignForm from '@entities/registration/RegistrationSignForm/ui/RegistrationSignForm';
import React from 'react';
import { RegistrationForm } from '@entities/registration/RegistrationForm';
import { OsiAccountsWidget } from '@widgets/osi/accounts';

import { RegistrationDocuments } from '@widgets/registration/documents/ui';
import { RegistrationAccountsWidget } from '@widgets/registration/accounts/ui/RegistrationAccountsWidget';

export type StepTitleType = 'info' | 'docs' | 'accounts' | 'sign' | StepCodes;

export interface Step {
  code: StepTitleType;
  labelToken: string;
  Content?: React.ReactNode | React.FC<any>;
  render?: (props: any) => React.ReactNode;
}

export enum StepCodes {
  info = 'info',
  docs = 'docs',
  accounts = 'accounts',
  sign = 'sign'
}

export const steps: Step[] = [
  {
    code: StepCodes.info,
    labelToken: tokens.cabinetRoot.registration.step1,
    Content: <RegistrationForm />
  },
  {
    code: StepCodes.docs,
    labelToken: tokens.cabinetRoot.registration.step2,
    Content: RegistrationDocuments
  },
  {
    code: StepCodes.accounts,
    labelToken: tokens.osiWizard.steps.step4,
    // Content: OsiAccountsWidget
    Content: RegistrationAccountsWidget
  },
  {
    code: StepCodes.sign,
    labelToken: tokens.cabinetRoot.registration.step3,
    Content: RegistrationSignForm
  }
];
