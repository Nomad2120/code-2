import { useController } from 'react-hook-form';
import { TextField } from '@mui/material';
import MaskInput from '@shared/common/MaskInput';
import { observer } from 'mobx-react-lite';
import { useTranslation } from '@/shared/utils/i18n';

// TODO: change types
interface BaseProps {
  name: string;
  control: any;
  mask?: any;
  children?: React.ReactNode[];

  [x: string]: any;
}

interface FieldProps {
  label?: string;
  rules?: any;
  fullWidth?: boolean;
  required?: boolean;
  select?: boolean;
  variant?: 'filled' | 'outlined' | 'standard';
  disabled?: boolean;
}

type Field = BaseProps & FieldProps;

type MaskedProps = Field & {
  mask: any;
};

type Props = Field | MaskedProps;

export const Field: React.FC<Props> = observer(
  ({ name, control, rules, select, mask, label, fullWidth, required, children, variant, disabled, ...otherProps }) => {
    const {
      field,
      fieldState: { error }
    } = useController({ name, control, rules });

    const { translateToken: tt } = useTranslation();

    if (select) {
      return (
        <TextField
          {...field}
          label={label}
          error={Boolean(error)}
          helperText={error && error.message && tt(error.message)}
          fullWidth={fullWidth}
          required={required}
          InputLabelProps={{
            shrink: true
          }}
          size="small"
          select
          variant={variant || 'outlined'}
          disabled={disabled}
          {...otherProps}
        >
          {children}
        </TextField>
      );
    }

    if (mask) {
      return (
        <MaskInput
          mask={mask}
          {...field}
          label={label}
          error={Boolean(error)}
          helperText={error && error.message && tt(error.message)}
          fullWidth={fullWidth}
          required={required}
          size="small"
          // @ts-expect-error-next-line not typed
          disabled={disabled}
          {...otherProps}
        />
      );
    }

    return (
      <TextField
        {...field}
        label={label}
        error={Boolean(error)}
        helperText={error && error.message && tt(error.message)}
        fullWidth={fullWidth}
        required={required}
        InputLabelProps={{
          shrink: true
        }}
        size="small"
        variant={variant || 'outlined'}
        disabled={disabled}
        {...otherProps}
      />
    );
  }
);
