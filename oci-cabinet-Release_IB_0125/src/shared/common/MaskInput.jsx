import { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { IMaskInput } from 'react-imask';

import NumberFormat from 'react-number-format';

import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const TextFieldStyled = styled(TextField)(() => ({
  width: '100%'
}));

const withValueLimit = (inputObj, maxLimit) => {
  const { value } = inputObj;
  if (!maxLimit) return true;
  if (maxLimit && value <= maxLimit) return true;
  return false;
};

const NumberFormatCustom = forwardRef((props, ref) => {
  const { onChange, maxLimit, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandSeparator=" "
      isNumericString
      decimalScale={2}
      allowNegative={false}
      allowedDecimalSeparators={[',', '.']}
      isAllowed={(e) => withValueLimit(e, maxLimit)}
    />
  );
});

const NumberFormatCustomWithNegative = forwardRef((props, ref) => {
  const { onChange, maxLimit, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandSeparator=" "
      isNumericString
      decimalScale={2}
      allowNegative
      allowedDecimalSeparators={[',', '.']}
      isAllowed={(e) => withValueLimit(e, maxLimit)}
    />
  );
});

NumberFormatCustom.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  maxLimit: PropTypes.number
};

NumberFormatCustomWithNegative.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  maxLimit: PropTypes.number
};

const TextMaskCustom = forwardRef((props, ref) => {
  const { onChange, mask, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask={mask}
      definitions={{
        '#': /[0-9]/
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string,
  mask: PropTypes.string,
  onChange: PropTypes.func
};

const MaskInput = (props) => {
  const {
    id = '',
    mask,
    label,
    name,
    helperText,
    error,
    type,
    align = 'left',
    size = 'normal',
    maxLimit,
    allowNegative,
    fullWidth = true,
    autoFocus = false,
    style = {},
    textFieldProps = {},
    required = false,
    disabled = false,
    ...other
  } = props;
  if (type === 'amount') {
    return (
      <TextFieldStyled
        label={label}
        {...other}
        required={required}
        error={error}
        helperText={helperText}
        name="numberformat"
        autoFocus={autoFocus}
        size={size}
        id="formatted-numberformat-input"
        disabled={disabled}
        InputLabelProps={{
          shrink: true
        }}
        InputProps={{
          inputComponent: allowNegative ? NumberFormatCustomWithNegative : NumberFormatCustom,
          inputProps: {
            maxLimit,
            style: { textAlign: align }
          }
        }}
      />
    );
  }
  return (
    <TextField
      fullWidth={fullWidth}
      required={required}
      label={label}
      name={name}
      error={error}
      autoFocus={autoFocus}
      size={size}
      helperText={helperText}
      disabled={disabled}
      InputLabelProps={{
        shrink: true
      }}
      InputProps={{
        inputComponent: TextMaskCustom,
        inputProps: {
          id,
          mask,
          style: { ...style, textAlign: align },
          ...other
        }
      }}
      {...textFieldProps}
    />
  );
};

MaskInput.propTypes = {
  id: PropTypes.string,
  mask: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  type: PropTypes.string,
  align: PropTypes.string,
  size: PropTypes.string,
  maxLimit: PropTypes.number,
  allowNegative: PropTypes.bool,
  fullWidth: PropTypes.bool,
  autoFocus: PropTypes.bool,
  style: PropTypes.object,
  sx: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  required: PropTypes.bool
};

export default MaskInput;
