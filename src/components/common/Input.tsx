/* eslint-disable no-unused-vars */
import React from 'react';
import { TextField } from '@mui/material';

interface IInputProps {
  value: string;
  setValue: (value: string) => void;
  label: string;
  type?: string;
  required?: boolean;
  name?: string;
  help?: string;
}
const NUMERIC_REGEX = /^[0-9]+$/;
const ALPHANUMERIC_SPACE_REGEX = /^[a-zA-Z0-9\s]*$/;
const ALLOWED_CHARACTERS_REGEX = /^[a-zA-Z0-9\s.,!?+\\-]*$/;

const Input = ({ value, setValue, label, type = 'text', required = true, name = '', help = '' }: IInputProps) => {
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = e;
    let regexPattern;

    if (type === 'number') {
      regexPattern = NUMERIC_REGEX;
    } else if (type === 'multiline') {
      regexPattern = ALLOWED_CHARACTERS_REGEX;
    } else {
      regexPattern = ALPHANUMERIC_SPACE_REGEX;
    }

    if (!regexPattern.test(key) && !['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      e.preventDefault();
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'number' && parseInt(e.target.value, 10) <= 0) {
      setValue('');
    } else {
      setValue(e.target.value);
    }
  };

  return (
    <TextField
      name={name}
      required={required}
      label={label}
      type={type}
      className="w-100"
      size="small"
      multiline={type === 'multiline'}
      rows={type === 'multiline' ? 4 : 1}
      helperText={help}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
};

export default Input;
