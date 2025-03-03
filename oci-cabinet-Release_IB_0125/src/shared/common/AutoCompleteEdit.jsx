import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, Grid, TextField, Typography } from '@mui/material';
import { debounce } from 'lodash';

AutoCompleteEdit.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.object,
  label: PropTypes.string,
  shortName: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onFetch: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  required: PropTypes.bool
};

// TODO: when click on option but in upper top position then value equal 0 why?
export default function AutoCompleteEdit({
  name,
  value,
  label,
  shortName,
  fullName,
  onChange,
  onFetch,
  error,
  helperText,
  required,
  ...rest
}) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const refAuto = useRef();

  const fetch = useMemo(
    () =>
      debounce(async (request, active) => {
        try {
          const data = await onFetch(request.input);
          if (active) {
            let newOptions = [];

            if (data) {
              newOptions = [...data];
            }

            setOptions(newOptions);
          }
        } catch (error) {
          console.error('error onFetch', error);
        }
      }, 500),
    [onFetch]
  );

  useEffect(() => {
    let active = true;

    if (!open) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, active);

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      noOptionsText="Нет доступных вариантов"
      name={name}
      ref={refAuto}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionLabel={
        (option) => (option && option[shortName]) || ''
        // !shortName || !fullName
        //   ? null
        //   : option[shortName] +
        //     ': ' +
        //     option[fullName]
        //       ?.split(',')
        //       ?.reverse()
        //       ?.join(',')
      }
      options={options}
      filterOptions={(x) => x}
      autoComplete
      filterSelectedOptions
      value={value}
      onChange={(event, newValue) => {
        event.target.name = refAuto.current.getAttribute('name');
        event.target.value = newValue ? { ...newValue } : null;
        onChange(event, newValue);
      }}
      onInputChange={(event, newInputValue, reason) => {
        setInputValue(newInputValue);
        if (reason === 'reset') {
          setOptions([]);
        }
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(props, option) => {
        const p = { ...props, key: option[fullName] };
        return (
          <li {...p}>
            <Grid container alignItems="center">
              <Grid item xs>
                {option[shortName]}

                <Typography variant="body2" color="textSecondary">
                  {option[fullName]}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          error={error}
          helperText={helperText}
          required={required}
          InputProps={{
            ...params.InputProps,
            // eslint-disable-next-line react/jsx-no-useless-fragment
            endAdornment: <>{params.InputProps.endAdornment}</>
          }}
          {...rest?.textFieldProps}
        />
      )}
      {...rest}
    />
  );
}
