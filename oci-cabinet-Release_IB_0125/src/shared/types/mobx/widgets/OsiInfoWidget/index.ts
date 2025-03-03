import { OsiInfoValues } from '@shared/types/osi';
import { UseFormReturn } from 'react-hook-form';

export type HookForm = UseFormReturn<OsiInfoValues> | null;

export interface OsiInfoWidgetViewModel {
  lockedFields: string[];
  formValues: OsiInfoValues;
  docs: any;
  hookForm: HookForm;
  setHookForm: (hookForm: HookForm) => void;
  submitForm: (values: any) => Promise<void>;
  osiUnionTypeName: {
    Ru: string;
    Kz: string;
  };
}

export const token = Symbol.for('OsiInfoWidgetViewModel');
