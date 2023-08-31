/* eslint-disable no-unused-vars */
import React from 'react';
import { TextField } from '@mui/material';

interface IInputProps {
  value: string;
  setValue: (value: string) => void;
  label: string;
  type?: string;
  required?: boolean;
}

const Input = ({ value, setValue, label, type = 'text', required = true }: IInputProps) => {
  return (
    <TextField
      required={required}
      label={label}
      type={type}
      className="w-100"
      size="small"
      multiline={type === 'multiline'}
      rows={type === 'multiline' ? 4 : 1}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default Input;
